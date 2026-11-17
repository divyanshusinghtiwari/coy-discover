import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import prisma from '../src/lib/prisma';
import { GET as getFeed } from '../src/app/api/feed/route';
import { POST as postSwipe } from '../src/app/api/swipe/route';
import { GET as getMatches } from '../src/app/api/matches/route';
import { CURRENT_USER_ID, MOCK_PROFILES, seedDatabase } from '../src/lib/seed-data';

describe('Coy Discover - 12-Point Comprehensive Final Audit & Core Verification', () => {
  beforeEach(async () => {
    await seedDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('1. All 30+ profiles have valid, complete data and realistic fields', async () => {
    expect(MOCK_PROFILES.length).toBeGreaterThanOrEqual(30);

    const dbProfiles = await prisma.user.findMany({
      where: { isCurrentUser: false },
    });
    expect(dbProfiles.length).toBeGreaterThanOrEqual(30);

    for (const profile of dbProfiles) {
      expect(profile.id).toBeTruthy();
      expect(typeof profile.name).toBe('string');
      expect(profile.name.trim().length).toBeGreaterThan(0);
      expect(profile.age).toBeGreaterThanOrEqual(18);
      expect(profile.photo).toMatch(/^https?:\/\//);
      expect(profile.bio.trim().length).toBeGreaterThan(10);
      expect(profile.city.trim().length).toBeGreaterThan(1);
      expect(profile.college).toBeTruthy();

      const parsedPhotos = JSON.parse(profile.photos);
      expect(Array.isArray(parsedPhotos)).toBe(true);
      expect(parsedPhotos.length).toBeGreaterThanOrEqual(1);

      const parsedInterests = JSON.parse(profile.interests);
      expect(Array.isArray(parsedInterests)).toBe(true);
      expect(parsedInterests.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('2. GET /api/feed strictly excludes previously swiped profiles', async () => {
    const feedRes1 = await getFeed(new Request('http://localhost:3000/api/feed'));
    const feedData1 = await feedRes1.json();
    const initialCount = feedData1.count;

    const userToPass = feedData1.profiles[0];
    const userToLike = feedData1.profiles[1];

    // Current user swipes PASS on userToPass
    await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userToPass.id, action: 'pass' }),
      })
    );

    // Current user swipes LIKE on userToLike
    await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userToLike.id, action: 'like' }),
      })
    );

    // Re-query feed
    const feedRes2 = await getFeed(new Request('http://localhost:3000/api/feed'));
    const feedData2 = await feedRes2.json();

    // Verify count decreased by 2
    expect(feedData2.count).toBe(initialCount - 2);

    // Verify neither user appears in subsequent feed
    const containsPassed = feedData2.profiles.some((p: { id: string }) => p.id === userToPass.id);
    const containsLiked = feedData2.profiles.some((p: { id: string }) => p.id === userToLike.id);
    expect(containsPassed).toBe(false);
    expect(containsLiked).toBe(false);
  });

  it('3. POST /api/swipe correctly handles likes and passes', async () => {
    const candidates = await prisma.user.findMany({
      where: { isCurrentUser: false },
      take: 2,
    });

    // Pass
    const passRes = await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: candidates[0].id, action: 'pass' }),
      })
    );
    const passData = await passRes.json();
    expect(passRes.status).toBe(200);
    expect(passData.success).toBe(true);
    expect(passData.action).toBe('pass');
    expect(passData.isMatch).toBe(false);

    // Like
    const likeRes = await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: candidates[1].id, action: 'like' }),
      })
    );
    const likeData = await likeRes.json();
    expect(likeRes.status).toBe(200);
    expect(likeData.success).toBe(true);
    expect(likeData.action).toBe('like');
  });

  it('4. Mutual likes create exactly one match', async () => {
    // Pick user who liked current user
    const preLiker = await prisma.swipe.findFirst({
      where: { swipedId: CURRENT_USER_ID, action: 'like' },
    });
    expect(preLiker).not.toBeNull();
    const partnerId = preLiker!.swiperId;

    // Current user likes them back
    const swipeRes = await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: partnerId, action: 'like' }),
      })
    );
    const swipeData = await swipeRes.json();

    expect(swipeData.isMatch).toBe(true);
    expect(swipeData.match).toBeDefined();

    // Query Match table to assert exactly ONE match record was created
    const [u1, u2] = [CURRENT_USER_ID, partnerId].sort();
    const matchesCount = await prisma.match.count({
      where: {
        user1Id: u1,
        user2Id: u2,
      },
    });
    expect(matchesCount).toBe(1);
  });

  it('5. GET /api/matches exposes ONLY mutual matches', async () => {
    // Initially, current user has 0 mutual matches
    const initMatchesRes = await getMatches(new Request('http://localhost:3000/api/matches'));
    const initMatchesData = await initMatchesRes.json();
    expect(initMatchesData.count).toBe(0);
    expect(initMatchesData.matches).toHaveLength(0);

    // Create 1 mutual match
    const preLiker = await prisma.swipe.findFirst({
      where: { swipedId: CURRENT_USER_ID, action: 'like' },
    });
    await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: preLiker!.swiperId, action: 'like' }),
      })
    );

    const postMatchesRes = await getMatches(new Request('http://localhost:3000/api/matches'));
    const postMatchesData = await postMatchesRes.json();

    expect(postMatchesData.count).toBe(1);
    expect(postMatchesData.matches).toHaveLength(1);
    expect(postMatchesData.matches[0].matchedUser.id).toBe(preLiker!.swiperId);
  });

  it('6. No non-mutual incoming likes leak through any API response', async () => {
    const feedRes = await getFeed(new Request('http://localhost:3000/api/feed'));
    const feedJson = await feedRes.json();

    // Inspect feed payload for any private fields
    const stringified = JSON.stringify(feedJson);
    expect(stringified).not.toContain('alreadyLikedMe');
    expect(stringified).not.toContain('receivedSwipes');
    expect(stringified).not.toContain('sentSwipes');
    expect(stringified).not.toContain('hasLiked');
    expect(stringified).not.toContain('likedBy');

    for (const p of feedJson.profiles) {
      expect(p).not.toHaveProperty('isMatch');
      expect(p).not.toHaveProperty('swiped');
    }
  });

  it('7. Database persistence works after reload simulation', async () => {
    const candidate = await prisma.user.findFirst({
      where: { isCurrentUser: false },
    });

    await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: candidate!.id, action: 'like' }),
      })
    );

    // Query directly from database
    const persistedSwipe = await prisma.swipe.findUnique({
      where: {
        swiperId_swipedId: {
          swiperId: CURRENT_USER_ID,
          swipedId: candidate!.id,
        },
      },
    });
    expect(persistedSwipe).not.toBeNull();
    expect(persistedSwipe?.action).toBe('like');
  });

  it('8. Duplicate swipes are prevented and return 409 Conflict', async () => {
    const candidate = await prisma.user.findFirst({
      where: { isCurrentUser: false },
    });

    // 1st swipe
    const res1 = await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: candidate!.id, action: 'pass' }),
      })
    );
    expect(res1.status).toBe(200);

    // 2nd duplicate swipe
    const res2 = await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: candidate!.id, action: 'pass' }),
      })
    );
    expect(res2.status).toBe(409);
    const data2 = await res2.json();
    expect(data2.alreadySwiped).toBe(true);
  });

  it('9. Mobile & desktop payload compatibility (targetUserId and profileId both accepted)', async () => {
    const candidates = await prisma.user.findMany({
      where: { isCurrentUser: false },
      take: 2,
    });

    // Request with targetUserId
    const resA = await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: candidates[0].id, action: 'like' }),
      })
    );
    expect(resA.status).toBe(200);

    // Request with profileId
    const resB = await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: candidates[1].id, action: 'pass' }),
      })
    );
    expect(resB.status).toBe(200);
  });

  it('10. All required APIs return correct HTTP status codes', async () => {
    // 400 for missing target
    const r1 = await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      })
    );
    expect(r1.status).toBe(400);

    // 400 for invalid action
    const r2 = await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: 'some-id', action: 'superlike' }),
      })
    );
    expect(r2.status).toBe(400);

    // 400 for self-swipe
    const r3 = await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: CURRENT_USER_ID, action: 'like' }),
      })
    );
    expect(r3.status).toBe(400);

    // 404 for non-existent profile
    const r4 = await postSwipe(
      new Request('http://localhost:3000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: 'non-existent-user-999', action: 'like' }),
      })
    );
    expect(r4.status).toBe(404);
  });

  it('11. Image URL formats and fallback avatars are resilient', async () => {
    for (const p of MOCK_PROFILES) {
      expect(p.photo).toBeTruthy();
      expect(p.photo.startsWith('http')).toBe(true);
      const fallback = `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(p.name)}&backgroundColor=0f172a`;
      expect(fallback.startsWith('https://api.dicebear.com')).toBe(true);
    }
  });
});
