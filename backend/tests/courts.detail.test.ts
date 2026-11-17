import { randomUUID } from 'node:crypto';
import { afterAll, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

afterAll(async () => {
  await prisma.$disconnect();
});

test.each([true, false])('GET /courts/:courtId returns a court with isActive=%s', async isActive => {
  expect(process.env.NODE_ENV).toBe('test');
  const databases = await prisma.$queryRaw<{ name: string }[]>`SELECT current_database() AS name`;
  expect(databases[0].name).toBe('football_booking_test');
  const branch = await prisma.branch.create({
    data: {
      name: `Detail branch ${randomUUID()}`,
      address: 'Test address',
      courts: { create: { name: 'Court A7', playersPerTeam: 7, pricePerSlot: 150000, isActive } },
    },
    include: { courts: true },
  });

  try {
    const response = await request(app).get(`/courts/${branch.courts[0].id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Lấy thông tin sân thành công',
      data: {
        id: branch.courts[0].id,
        name: 'Court A7',
        playersPerTeam: 7,
        pricePerSlot: 150000,
        isActive,
        branch: { id: branch.id, name: branch.name, address: branch.address },
      },
    });
  } finally {
    await prisma.$transaction([
      prisma.court.deleteMany({ where: { branchId: branch.id } }),
      prisma.branch.delete({ where: { id: branch.id } }),
    ]);
  }
});

test('GET /courts/:courtId rejects an invalid UUID', async () => {
  const response = await request(app).get('/courts/not-a-uuid');

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Dữ liệu không hợp lệ.',
      details: [{ field: 'courtId', message: 'courtId phải là UUID hợp lệ.' }],
    },
  });
});

test('GET /courts/:courtId returns 404 for a missing court', async () => {
  const response = await request(app).get(`/courts/${randomUUID()}`);

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    success: false,
    error: { code: 'COURT_NOT_FOUND', message: 'Không tìm thấy sân.' },
  });
});
