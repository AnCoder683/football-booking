import { prisma } from '../../lib/prisma.js';
import { Prisma } from '../../generated/prisma/client.js';
import type { CourtAvailabilityQuery, CreateCourtBody, ListAdminCourtsQuery, UpdateCourtBody } from './courts.schema.js';

export async function getCourtAvailability(courtId: string, { date, durationMinutes }: CourtAvailabilityQuery) {
  const court = await prisma.court.findUnique({
    where: { id: courtId },
    select: { isActive: true },
  });
  if (court === null) return { status: 'COURT_NOT_FOUND' } as const;
  if (!court.isActive) return { status: 'COURT_INACTIVE' } as const;

  const opening = new Date(`${date}T06:00:00+07:00`).getTime();
  const closing = new Date(`${date}T22:00:00+07:00`).getTime();
  const slotMilliseconds = 30 * 60 * 1000;
  const durationMilliseconds = durationMinutes * 60 * 1000;
  const occupiedSlots = await prisma.bookingSlot.findMany({
    where: {
      courtId,
      releasedAt: null,
      startAt: { gte: new Date(opening), lt: new Date(closing) },
    },
    select: { startAt: true },
  });
  const now = Date.now();
  const availableStarts: { startAt: string; endAt: string }[] = [];
  for (let start = opening; start + durationMilliseconds <= closing; start += slotMilliseconds) {
    if (start <= now) continue;
    const end = start + durationMilliseconds;
    const overlaps = occupiedSlots.some(slot => {
      const occupiedStart = slot.startAt.getTime();
      const occupiedEnd = occupiedStart + slotMilliseconds;
      return occupiedStart < end && occupiedEnd > start;
    });
    if (overlaps) continue;

    availableStarts.push({
      startAt: new Date(start).toISOString(),
      endAt: new Date(end).toISOString(),
    });
  }

  return { status: 'OK', data: { courtId, date, durationMinutes, availableStarts } } as const;
}

export async function updateCourt(courtId: string, body: UpdateCourtBody) {
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
      // UPDATE báo P2025 nếu sân không tồn tại, không cần SELECT trước.
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

export async function listCourts({ page, limit, branchId, playersPerTeam, isActive }: ListAdminCourtsQuery) {
  // Prisma bỏ qua bộ lọc undefined; false vẫn lọc sân ngừng hoạt động.
  const where = { isActive, branchId, playersPerTeam };
  const total = await prisma.court.count({ where });
  const skip = (page - 1) * limit;
  // Avoid an oversized DB offset for out-of-range pages.
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
