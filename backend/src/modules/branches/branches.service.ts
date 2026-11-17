import { prisma } from '../../lib/prisma.js';

export async function listBranches() {
  return prisma.branch.findMany({
    select: { id: true, name: true, address: true },
    orderBy: [{ name: 'asc' }, { id: 'asc' }],
  });
}
