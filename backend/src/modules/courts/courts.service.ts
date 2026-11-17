import { prisma } from '../../lib/prisma.js';
import { Prisma } from '../../generated/prisma/client.js';
import type { CreateCourtBody, ListCourtsQuery, UpdateCourtBody } from './courts.schema.js';

export async function updateCourt(courtId: string, body: UpdateCourtBody) {
  const existingCourt = await prisma.court.findUnique({ where: { id: courtId }, select: { id: true } });
  if (existingCourt === null) return { status: 'COURT_NOT_FOUND' } as const;

  try {
    // One UPDATE keeps all fields atomic; omitted fields are not written.
    const court = await prisma.court.update({
      where: { id: courtId },
      data: body,
      select: {
        id: true,
        name: true,
        playersPerTeam: true,
        pricePerSlot: true,
        isActive: true,
        branch: { select: { id: true, name: true, address: true } },
      },
    });
    return { status: 'UPDATED', data: court } as const;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const adapterError = error.meta?.driverAdapterError as
        { cause?: { constraint?: { index?: string } } } | undefined;
      if (error.code === 'P2002' &&
          adapterError?.cause?.constraint?.index === 'Court_branchId_normalizedName_key') {
        return { status: 'COURT_NAME_CONFLICT' } as const;
      }
      // A court deleted after the existence check is still a 404.
      if (error.code === 'P2025') return { status: 'COURT_NOT_FOUND' } as const;
    }
    throw error;
  }
}

export async function createCourt(body: CreateCourtBody) {
  const branch = await prisma.branch.findUnique({ where: { id: body.branchId }, select: { id: true } });
  if (branch === null) return { status: 'BRANCH_NOT_FOUND' } as const;

  try {
    const court = await prisma.court.create({
      data: body,
      select: {
        id: true,
        name: true,
        playersPerTeam: true,
        pricePerSlot: true,
        isActive: true,
        branch: { select: { id: true, name: true, address: true } },
      },
    });
    return { status: 'CREATED', data: court } as const;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Prisma's pg adapter reports the violated index in cause.constraint, not meta.target.
      const adapterError = error.meta?.driverAdapterError as
        { cause?: { constraint?: { index?: string } } } | undefined;
      if (error.code === 'P2002' &&
          adapterError?.cause?.constraint?.index === 'Court_branchId_normalizedName_key') {
        return { status: 'COURT_NAME_CONFLICT' } as const;
      }
      // The branch may have been deleted after the existence check.
      if (error.code === 'P2003') {
        const existingBranch = await prisma.branch.findUnique({ where: { id: body.branchId }, select: { id: true } });
        if (existingBranch === null) return { status: 'BRANCH_NOT_FOUND' } as const;
      }
    }
    throw error;
  }
}

export async function getCourt(courtId: string) {
  return prisma.court.findUnique({
    where: { id: courtId },
    select: {
      id: true,
      name: true,
      playersPerTeam: true,
      pricePerSlot: true,
      isActive: true,
      branch: { select: { id: true, name: true, address: true } },
    },
  });
}

export async function listCourts({ page, limit, branchId, playersPerTeam }: ListCourtsQuery) {
  const where = {
    isActive: true,
    ...(branchId === undefined ? {} : { branchId }),
    ...(playersPerTeam === undefined ? {} : { playersPerTeam }),
  };
  const total = await prisma.court.count({ where });
  const skip = (page - 1) * limit;
  // Avoid an oversized DB offset for out-of-range pages.
  // This is an ordinary list, not a held quote or a reserved slot.
  const data = skip >= total ? [] : await prisma.court.findMany({
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
}
