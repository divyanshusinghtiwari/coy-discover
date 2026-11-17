import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/user';
import { Profile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const currentUserId = await getCurrentUserId();

    // 1. Fetch IDs of all profiles already swiped by the current user
    const swipedRecords = await prisma.swipe.findMany({
      where: { swiperId: currentUserId },
      select: { swipedId: true },
    });

    const swipedIds = swipedRecords.map((s) => s.swipedId);
    // Also exclude the current user
    const excludeIds = [...swipedIds, currentUserId];

    // 2. Fetch candidate profiles excluding already swiped and current user
    // PRIVACY ENFORCEMENT: Strictly select public fields only.
    // Do NOT include receivedSwipes, sentSwipes, or any like/match relational data.
    const candidates = await prisma.user.findMany({
      where: {
        id: {
          notIn: excludeIds,
        },
        isCurrentUser: false,
      },
      select: {
        id: true,
        name: true,
        age: true,
        photo: true,
        photos: true,
        bio: true,
        city: true,
        college: true,
        interests: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // 3. Format and sanitize output (safe JSON parsing of arrays)
    const sanitizedProfiles: Profile[] = candidates.map((user) => {
      let parsedPhotos: string[] = [];
      let parsedInterests: string[] = [];

      try {
        parsedPhotos = JSON.parse(user.photos);
      } catch {
        parsedPhotos = [user.photo];
      }

      try {
        parsedInterests = JSON.parse(user.interests);
      } catch {
        parsedInterests = [];
      }

      return {
        id: user.id,
        name: user.name,
        age: user.age,
        photo: user.photo,
        photos: parsedPhotos.length > 0 ? parsedPhotos : [user.photo],
        bio: user.bio,
        city: user.city,
        college: user.college,
        interests: parsedInterests,
      };
    });

    return NextResponse.json({
      success: true,
      count: sanitizedProfiles.length,
      profiles: sanitizedProfiles,
    });
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching discovery feed' },
      { status: 500 }
    );
  }
}
