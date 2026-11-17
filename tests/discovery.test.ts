import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import prisma from '../src/lib/prisma';
import { GET as getFeed } from '../src/app/api/feed/route';
import { POST as postSwipe } from '../src/app/api/swipe/route';
import { GET as getMatches } from '../src/app/api/matches/route';
import { CURRENT_USER_ID, seedDatabase } from '../src/lib/seed-data';

describe('Coy Discover - Core Functionality & Privacy Test Suite', () => {
  beforeEach(async () => {
    // Re-seed before test suite runs to have a pristine baseline
    await seedDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('1. Like and Pass functionality: records swipe actions correctly', async () => {
    // Pick candidate profiles from database
    const candidates = await prisma.user.findMany({
      where: { isCurrentUser: false },
      take: 2,
    });

    expect(candidates.length).toBeGreaterThanOrEqual(2);
    const profileA = candidates[0];
    const profileB = candidates[1];

    // Current user swipes 'pass' on profileA
    const passReq = new Request('http://localhost:3000/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUserId: profileA.id,
        action: 'pass',
      }),
    });

    const passRes = await postSwipe(passReq);
    expect(passRes.status).toBe(200);
    const passData = await passRes.json();
    expect(passData.success).toBe(true);
    expect(passData.action).toBe('pass');
    expect(passData.isMatch).toBe(false);

    // Verify 'pass' swipe in database
    const savedPass = await prisma.swipe.findUnique({
      where: {
        swiperId_swipedId: {
          swiperId: CURRENT_USER_ID,
          swipedId: profileA.id,
        },
      },
    });
    expect(savedPass).not.toBeNull();
    expect(savedPass?.action).toBe('pass');

    // Current user swipes 'like' on profileB
    const likeReq = new Request('http://localhost:3000/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUserId: profileB.id,
        action: 'like',
      }),
    });

    const likeRes = await postSwipe(likeReq);
    expect(likeRes.status).toBe(200);
    const likeData = await likeRes.json();
    expect(likeData.success).toBe(true);
    expect(likeData.action).toBe('like');

    // Verify 'like' swipe in database
    const savedLike = await prisma.swipe.findUnique({
      where: {
        swiperId_swipedId: {
          swiperId: CURRENT_USER_ID,
          swipedId: profileB.id,
        },
      },
    });
    expect(savedLike).not.toBeNull();
    expect(savedLike?.action).toBe('like');
  });

  it('2. Mutual Matching: match occurs only if both users liked each other', async () => {
    // Find a profile that already liked current user (e.g. Maya)
    const incomingLike = await prisma.swipe.findFirst({
      where: {
        swipedId: CURRENT_USER_ID,
        action: 'like',
      },
      include: { swiper: true },
    });

    expect(incomingLike).not.toBeNull();
    const mutualTargetId = incomingLike!.swiperId;

    // Current user swipes 'like' on the user who liked them
    const matchReq = new Request('http://localhost:3000/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUserId: mutualTargetId,
        action: 'like',
      }),
    });

    const matchRes = await postSwipe(matchReq);
    const matchData = await matchRes.json();

    expect(matchRes.status).toBe(200);
    expect(matchData.success).toBe(true);
    expect(matchData.isMatch).toBe(true);
    expect(matchData.match).toBeDefined();
    expect(matchData.match.matchedUser.id).toBe(mutualTargetId);

    // Verify Match record exists in database
    const [u1, u2] = [CURRENT_USER_ID, mutualTargetId].sort();
    const matchInDb = await prisma.match.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id: u1,
          user2Id: u2,
        },
      },
    });
    expect(matchInDb).not.toBeNull();

    // Now test a profile that has NOT liked the current user
    const nonLiker = await prisma.user.findFirst({
      where: {
        isCurrentUser: false,
        sentSwipes: {
          none: {
            swipedId: CURRENT_USER_ID,
          },
        },
      },
    });
    expect(nonLiker).not.toBeNull();

    const nonMatchReq = new Request('http://localhost:3000/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUserId: nonLiker!.id,
        action: 'like',
      }),
    });

    const nonMatchRes = await postSwipe(nonMatchReq);
    const nonMatchData = await nonMatchRes.json();

    expect(nonMatchRes.status).toBe(200);
    expect(nonMatchData.success).toBe(true);
    expect(nonMatchData.isMatch).toBe(false);
    expect(nonMatchData.match).toBeUndefined();

    // Verify NO match record was created in database
    const [nu1, nu2] = [CURRENT_USER_ID, nonLiker!.id].sort();
    const noMatchInDb = await prisma.match.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id: nu1,
          user2Id: nu2,
        },
      },
    });
    expect(noMatchInDb).toBeNull();
  });

  it('3. Strict Privacy: non-mutual likes remain private and hidden', async () => {
    // 3A: Inspect /api/feed output
    const feedReq = new Request('http://localhost:3000/api/feed');
    const feedRes = await getFeed(feedReq);
    const feedData = await feedRes.json();

    expect(feedRes.status).toBe(200);
    expect(feedData.profiles.length).toBeGreaterThan(0);

    // Verify that NO profile in the feed payload contains any incoming like data
    for (const profile of feedData.profiles) {
      expect(profile).not.toHaveProperty('alreadyLikedMe');
      expect(profile).not.toHaveProperty('hasLiked');
      expect(profile).not.toHaveProperty('receivedSwipes');
      expect(profile).not.toHaveProperty('sentSwipes');
      expect(profile).not.toHaveProperty('isMatch');

      // Ensure only allowed public profile keys exist
      const allowedKeys = ['id', 'name', 'age', 'photo', 'photos', 'bio', 'city', 'college', 'interests'];
      const profileKeys = Object.keys(profile);
      for (const key of profileKeys) {
        expect(allowedKeys).toContain(key);
      }
    }

    // 3B: Inspect /api/matches output before any mutual match is made
    const matchesReq = new Request('http://localhost:3000/api/matches');
    const matchesRes = await getMatches(matchesReq);
    const matchesData = await matchesRes.json();

    expect(matchesRes.status).toBe(200);
    // Since current user has not liked anyone back yet, matches must be 0
    // even though 8 people have incoming likes!
    expect(matchesData.count).toBe(0);
    expect(matchesData.matches).toEqual([]);
  });

  it('4. Duplicate Swipe Prevention: prevents duplicate swipes on same profile', async () => {
    const candidate = await prisma.user.findFirst({
      where: { isCurrentUser: false },
    });
    expect(candidate).not.toBeNull();

    // First swipe
    const firstReq = new Request('http://localhost:3000/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUserId: candidate!.id,
        action: 'like',
      }),
    });
    const firstRes = await postSwipe(firstReq);
    expect(firstRes.status).toBe(200);

    // Duplicate swipe attempt on the exact same candidate
    const dupReq = new Request('http://localhost:3000/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUserId: candidate!.id,
        action: 'like',
      }),
    });
    const dupRes = await postSwipe(dupReq);
    expect(dupRes.status).toBe(409);
    const dupData = await dupRes.json();
    expect(dupData.success).toBe(false);
    expect(dupData.alreadySwiped).toBe(true);

    // Verify only 1 swipe record exists in the database
    const swipeCount = await prisma.swipe.count({
      where: {
        swiperId: CURRENT_USER_ID,
        swipedId: candidate!.id,
      },
    });
    expect(swipeCount).toBe(1);
  });

  it('5. Feed Filtering: excludes previously swiped profiles', async () => {
    // Initial feed fetch
    const feed1Res = await getFeed(new Request('http://localhost:3000/api/feed'));
    const feed1Data = await feed1Res.json();
    const initialCount = feed1Data.count;
    expect(initialCount).toBe(32);

    const firstProfile = feed1Data.profiles[0];

    // Swipe pass on the first profile
    await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: firstProfile.id,
          action: 'pass',
        }),
      })
    );

    // Second feed fetch
    const feed2Res = await getFeed(new Request('http://localhost:3000/api/feed'));
    const feed2Data = await feed2Res.json();

    // Count should decrease by 1
    expect(feed2Data.count).toBe(initialCount - 1);

    // Swiped profile must not exist in subsequent feed
    const found = feed2Data.profiles.some((p: { id: string }) => p.id === firstProfile.id);
    expect(found).toBe(false);
  });

  it('6. Persistence after Reload: state survives simulation and query reloads', async () => {
    // Find candidate who liked current user
    const liker = await prisma.swipe.findFirst({
      where: { swipedId: CURRENT_USER_ID, action: 'like' },
    });
    expect(liker).not.toBeNull();

    // Swipe like on that user
    await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: liker!.swiperId,
          action: 'like',
        }),
      })
    );

    // Simulate "Page Reload" by querying matches endpoint freshly
    const matchesRes = await getMatches(new Request('http://localhost:3000/api/matches'));
    const matchesData = await matchesRes.json();

    expect(matchesData.count).toBe(1);
    expect(matchesData.matches[0].matchedUser.id).toBe(liker!.swiperId);

    // Verify direct database persistence query
    const dbMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { user1Id: CURRENT_USER_ID, user2Id: liker!.swiperId },
          { user1Id: liker!.swiperId, user2Id: CURRENT_USER_ID },
        ],
      },
    });
    expect(dbMatch).not.toBeNull();

    // Verify swipe is also persisted in database
    const dbSwipe = await prisma.swipe.findUnique({
      where: {
        swiperId_swipedId: {
          swiperId: CURRENT_USER_ID,
          swipedId: liker!.swiperId,
        },
      },
    });
    expect(dbSwipe).not.toBeNull();
    expect(dbSwipe?.action).toBe('like');
  });
});
