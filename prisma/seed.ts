import { seedDatabase } from '../src/lib/seed-data';
import prisma from '../src/lib/prisma';

seedDatabase()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
