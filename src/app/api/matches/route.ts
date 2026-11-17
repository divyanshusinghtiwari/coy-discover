import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/user';
import { MatchItem, Profile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const currentUserId = await getCurrentUserId();

    // Fetch only confirmed mutual matches where current user is either user1 or user2
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: currentUserId }, { user2Id: currentUserId }],
      },
      include: {
        user1: {
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
        },
        user2: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedMatches: MatchItem[] = matches.map((match) => {
      // The other user is the match
      const partner = match.user1Id === currentUserId ? match.user2 : match.user1;

      let parsedPhotos: string[] = [];
      let parsedInterests: string[] = [];

      try {
        parsedPhotos = JSON.parse(partner.photos);
      } catch {
        parsedPhotos = [partner.photo];
      }

      try {
        parsedInterests = JSON.parse(partner.interests);
      } catch {
        parsedInterests = [];
      }

      const matchedProfile: Profile = {
        id: partner.id,
        name: partner.name,
        age: partner.age,
        photo: partner.photo,
        photos: parsedPhotos.length > 0 ? parsedPhotos : [partner.photo],
        bio: partner.bio,
        city: partner.city,
        college: partner.college,
        interests: parsedInterests,
      };

      return {
        id: match.id,
        matchedUser: matchedProfile,
        matchedAt: match.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      count: formattedMatches.length,
      matches: formattedMatches,
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching matches' },
      { status: 500 }
    );
  }
}
