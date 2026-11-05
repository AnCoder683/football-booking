import { prisma } from '../lib/prisma.js';

// Fixed IDs identify demo records across runs; these are sample prices per 30 min.
const branch = {
  id: 'd0000000-0000-4000-8000-000000000001',
  name: 'Chi nhánh Demo',
  address: 'Địa chỉ minh họa — không phải địa điểm thật',
};

const courts = [
  {
    id: 'd1000000-0000-4000-8000-000000000001',
    name: 'Sân 5 Demo',
    playersPerTeam: 5,
    pricePerSlot: 150000,
  },
  {
    id: 'd1000000-0000-4000-8000-000000000002',
    name: 'Sân 7 Demo',
    playersPerTeam: 7,
    pricePerSlot: 250000,
  },
  {
    id: 'd1000000-0000-4000-8000-000000000003',
    name: 'Sân 11 Demo',
    playersPerTeam: 11,
    pricePerSlot: 400000,
  },
];

try {
  // All demo records are created together or rolled back together.
  // Empty update preserves any later edits to records already present.
  await prisma.$transaction(async (tx) => {
    await tx.branch.upsert({
      where: { id: branch.id },
      create: branch,
      update: {},
    });

    for (const court of courts) {
      await tx.court.upsert({
        where: { id: court.id },
        create: { ...court, branchId: branch.id },
        update: {},
      });
    }
  });

  console.log('Seed OK: demo branch/courts exist; existing records preserved.');
  console.table(await prisma.court.findMany({
    where: { id: { in: courts.map((court) => court.id) } },
    select: { name: true, playersPerTeam: true, pricePerSlot: true, isActive: true },
    orderBy: { playersPerTeam: 'asc' },
  }));
} catch {
  // Avoid logging connection strings or credentials.
  console.error('Seed failed. Check local DB, applied migrations and demo name conflicts.');
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
