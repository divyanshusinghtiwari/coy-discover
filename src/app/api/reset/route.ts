import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await seedDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database reset and seeded with 32 profiles and 8 incoming likes successfully.',
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset database' },
      { status: 500 }
    );
  }
}
