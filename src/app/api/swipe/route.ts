import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/user';
import { Profile, SwipeResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const currentUserId = await getCurrentUserId();
    const body = await request.json().catch(() => ({}));

    // Accept either targetUserId or profileId for maximum compatibility
    const targetUserId = body.targetUserId || body.profileId;
    const action = body.action;

    // 1. Validation
    if (!targetUserId || typeof targetUserId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing target profile ID' },
        { status: 400 }
      );
    }

    if (action !== 'like' && action !== 'pass') {
      return NextResponse.json(
        { success: false, error: "Action must be either 'like' or 'pass'" },
        { status: 400 }
      );
    }

    if (targetUserId === currentUserId) {
      return NextResponse.json(
        { success: false, error: 'Cannot swipe on your own profile' },
        { status: 400 }
      );
    }

    // 2. Verify target profile exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'Target profile not found' },
        { status: 404 }
      );
    }

    // 3. Prevent duplicate swipe
    const existingSwipe = await prisma.swipe.findUnique({
      where: {
        swiperId_swipedId: {
          swiperId: currentUserId,
          swipedId: targetUserId,
        },
      },
    });

    if (existingSwipe) {
      return NextResponse.json(
        {
          success: false,
          error: 'You have already swiped on this profile',
          alreadySwiped: true,
        },
        { status: 409 }
      );
    }

    // 4. Check if target user has previously liked current user
    const incomingSwipe = await prisma.swipe.findUnique({
      where: {
        swiperId_swipedId: {
          swiperId: targetUserId,
          swipedId: currentUserId,
        },
      },
    });

    const isMutualMatch = action === 'like' && incomingSwipe?.action === 'like';

    // 5. Execute transaction: persist swipe and create match if mutual
    let matchRecord: { id: string; createdAt: Date } | null = null;

    if (isMutualMatch) {
      const [u1, u2] = [currentUserId, targetUserId].sort();

      const result = await prisma.$transaction(async (tx) => {
        // Record swipe
        await tx.swipe.create({
          data: {
            swiperId: currentUserId,
            swipedId: targetUserId,
            action: 'like',
          },
        });

        // Create or get match
        const match = await tx.match.upsert({
          where: {
            user1Id_user2Id: {
              user1Id: u1,
              user2Id: u2,
            },
          },
          update: {},
          create: {
            user1Id: u1,
            user2Id: u2,
          },
        });

        return match;
      });

      matchRecord = result;
    } else {
      // Single swipe record
      await prisma.swipe.create({
        data: {
          swiperId: currentUserId,
          swipedId: targetUserId,
          action: action,
        },
      });
    }

    // 6. Construct response
    if (isMutualMatch && matchRecord) {
      let parsedPhotos: string[] = [];
      let parsedInterests: string[] = [];
      try {
        parsedPhotos = JSON.parse(targetUser.photos);
      } catch {
        parsedPhotos = [targetUser.photo];
      }
      try {
        parsedInterests = JSON.parse(targetUser.interests);
      } catch {
        parsedInterests = [];
      }

      const matchedProfile: Profile = {
        id: targetUser.id,
        name: targetUser.name,
        age: targetUser.age,
        photo: targetUser.photo,
        photos: parsedPhotos.length > 0 ? parsedPhotos : [targetUser.photo],
        bio: targetUser.bio,
        city: targetUser.city,
        college: targetUser.college,
        interests: parsedInterests,
      };

      const response: SwipeResponse = {
        success: true,
        action: 'like',
        isMatch: true,
        match: {
          id: matchRecord.id,
          matchedUser: matchedProfile,
          matchedAt: matchRecord.createdAt.toISOString(),
        },
      };

      return NextResponse.json(response);
    }

    const response: SwipeResponse = {
      success: true,
      action: action,
      isMatch: false,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing swipe:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing swipe' },
      { status: 500 }
    );
  }
}
