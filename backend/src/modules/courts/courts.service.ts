import type { PrismaClient } from '../../generated/prisma/client.js';
import type { ListCourtsQuery } from './courts.validation.js';

export function createCourtsService(database: PrismaClient) {
  return {
    async listCourts({ page, limit, branchId, playersPerTeam }: ListCourtsQuery) {
      const where = {
        isActive: true,
        ...(branchId === undefined ? {} : { branchId }),
        ...(playersPerTeam === undefined ? {} : { playersPerTeam }),
      };
      const total = await database.court.count({ where });
      const skip = (page - 1) * limit;
      // Avoid an oversized DB offset for out-of-range pages.
      // This is an ordinary list, not a held quote or a reserved slot.
      const data = skip >= total ? [] : await database.court.findMany({
        where,
        select: {
          id: true,
          name: true,
          playersPerTeam: true,
          pricePerSlot: true,
          isActive: true,
          branch: { select: { id: true, name: true, address: true } },
        },
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
        skip,
        take: limit,
      });

      return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    },
  };
}
