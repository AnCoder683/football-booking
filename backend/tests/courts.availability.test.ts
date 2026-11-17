import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

let branchId = '';
let courtId: string;
let userId = '';
const date = '2026-11-18';

beforeAll(async () => {
  expect(process.env.NODE_ENV).toBe('test');
  const databases = await prisma.$queryRaw<{ name: string }[]>`SELECT current_database() AS name`;
  expect(databases[0].name).toBe('football_booking_test');
});

beforeEach(async () => {
  vi.spyOn(Date, 'now').mockReturnValue(Date.parse('2026-11-17T03:00:00Z'));
  branchId = '';
  userId = '';
  const branch = await prisma.branch.create({
    data: {
      name: `Availability ${randomUUID()}`, address: 'Test address',
      courts: { create: { name: 'Court A', playersPerTeam: 7, pricePerSlot: 150000 } },
    },
    include: { courts: true },
  });
  branchId = branch.id;
  courtId = branch.courts[0].id;
});

afterEach(async () => {
  vi.restoreAllMocks();
  if (branchId) await prisma.$transaction([
    prisma.bookingSlot.deleteMany({ where: { courtId } }),
    prisma.booking.deleteMany({ where: { courtId } }),
    prisma.court.deleteMany({ where: { branchId } }),
    prisma.branch.delete({ where: { id: branchId } }),
  ]);
  if (userId) await prisma.user.delete({ where: { id: userId } });
});

afterAll(async () => { await prisma.$disconnect(); });

test.each([
  { durationMinutes: 30, count: 32, last: '21:30' },
  { durationMinutes: 60, count: 31, last: '21:00' },
  { durationMinutes: 90, count: 30, last: '20:30' },
  { durationMinutes: 120, count: 29, last: '20:00' },
])('returns all $durationMinutes-minute starts with a final end at 22:00', async ({ durationMinutes, count, last }) => {
  // The last case also checks the inclusive today + 7 boundary.
  const selectedDate = durationMinutes === 120 ? '2026-11-24' : date;
  const response = await request(app).get(`/courts/${courtId}/availability`).query({ date: selectedDate, durationMinutes });

  expect(response.status).toBe(200);
  expect(response.headers['cache-control']).toBe('no-store');
  expect(response.body).toMatchObject({
    success: true, message: 'Lấy giờ trống thành công',
    data: { courtId, date: selectedDate, durationMinutes },
  });
  const starts = response.body.data.availableStarts;
  expect(starts).toHaveLength(count);
  expect(starts[0].startAt).toBe(new Date(`${selectedDate}T06:00:00+07:00`).toISOString());
  expect(starts[count - 1]).toEqual({
    startAt: new Date(`${selectedDate}T${last}:00+07:00`).toISOString(),
    endAt: new Date(`${selectedDate}T22:00:00+07:00`).toISOString(),
  });
  for (let index = 0; index < starts.length; index++) {
    expect(Date.parse(starts[index].endAt) - Date.parse(starts[index].startAt)).toBe(durationMinutes * 60000);
    if (index > 0) expect(Date.parse(starts[index].startAt) - Date.parse(starts[index - 1].startAt)).toBe(30 * 60000);
  }
});

test.each([
  { description: 'missing fields', query: {}, field: 'durationMinutes' },
  { description: 'impossible date', query: { date: '2026-11-31', durationMinutes: '30' }, field: 'date' },
  { description: 'wrong date format', query: { date: '2026-11-8', durationMinutes: '30' }, field: 'date' },
  { description: 'unsupported duration', query: { date, durationMinutes: '45' }, field: 'durationMinutes' },
  { description: 'yesterday', query: { date: '2026-11-16', durationMinutes: '30' }, field: 'date' },
  { description: 'today plus eight days', query: { date: '2026-11-25', durationMinutes: '30' }, field: 'date' },
])('rejects $description before looking up a court', async ({ query, field, description }) => {
  const response = await request(app).get(`/courts/${randomUUID()}/availability`).query(query);

  expect(response.status).toBe(400);
  expect(response.body.error.code).toBe('VALIDATION_ERROR');
  expect(response.body.error.details).toEqual(expect.arrayContaining([expect.objectContaining({ field })]));
  if (description === 'impossible date') expect(response.body.error.details).toContainEqual({
    field: 'date', message: 'date phải là ngày lịch hợp lệ.',
  });
  if (description === 'missing fields') expect(response.body.error.details)
    .toEqual(expect.arrayContaining([expect.objectContaining({ field: 'date' })]));
});

test.each([
  { kind: 'invalid ID', status: 400, code: 'VALIDATION_ERROR' },
  { kind: 'missing court', status: 404, code: 'COURT_NOT_FOUND' },
  { kind: 'inactive court', status: 409, code: 'COURT_INACTIVE' },
])('rejects $kind', async ({ kind, status, code }) => {
  if (kind === 'inactive court') await prisma.court.update({ where: { id: courtId }, data: { isActive: false } });
  const id = kind === 'invalid ID' ? 'invalid' : kind === 'missing court' ? randomUUID() : courtId;
  const response = await request(app).get(`/courts/${id}/availability`).query({ date, durationMinutes: 60 });

  expect(response.status).toBe(status);
  expect(response.body.error.code).toBe(code);
});

test('today only includes starts strictly after the current time', async () => {
  vi.mocked(Date.now).mockReturnValue(Date.parse('2026-11-18T12:00:00Z')); // 19:00 Vietnam.
  const response = await request(app).get(`/courts/${courtId}/availability`).query({ date, durationMinutes: 60 });

  expect(response.status).toBe(200);
  expect(response.body.data.availableStarts).toHaveLength(4);
  expect(response.body.data.availableStarts[0].startAt).toBe('2026-11-18T12:30:00.000Z');
});

test('today returns an empty list at closing time', async () => {
  vi.mocked(Date.now).mockReturnValue(Date.parse('2026-11-18T15:00:00Z')); // 22:00 Vietnam.
  const response = await request(app).get(`/courts/${courtId}/availability`).query({ date, durationMinutes: 30 });

  expect(response.status).toBe(200);
  expect(response.body.data.availableStarts).toEqual([]);
});

test('uses the Vietnam calendar date when UTC is still on the previous day', async () => {
  vi.mocked(Date.now).mockReturnValue(Date.parse('2026-11-17T17:30:00Z')); // Nov 18, 00:30 Vietnam.
  const today = await request(app).get(`/courts/${courtId}/availability`).query({ date, durationMinutes: 30 });
  const yesterday = await request(app).get(`/courts/${courtId}/availability`).query({ date: '2026-11-17', durationMinutes: 30 });

  expect(today.status).toBe(200);
  expect(today.body.data.availableStarts[0].startAt).toBe('2026-11-17T23:00:00.000Z');
  expect(yesterday.status).toBe(400);
});

test('excludes overlapping intervals, allows touching boundaries and ignores released slots', async () => {
  const user = await prisma.user.create({ data: {
    name: 'Availability', email: `availability-${randomUUID()}@example.com`, passwordHash: 'not-used-for-login',
  } });
  userId = user.id;
  const booking = await prisma.booking.create({ data: {
    userId, courtId, startAt: new Date(`${date}T19:00:00+07:00`), endAt: new Date(`${date}T20:00:00+07:00`),
    pricePerSlot: 150000, totalPrice: 300000,
  } });
  await prisma.bookingSlot.createMany({ data: ['19:00', '19:30'].map(hour => ({
    bookingId: booking.id, courtId, startAt: new Date(`${date}T${hour}:00+07:00`),
  })) });
  const cancelledAt = new Date();
  const cancelled = await prisma.booking.create({ data: {
    userId, courtId, startAt: new Date(`${date}T20:00:00+07:00`), endAt: new Date(`${date}T20:30:00+07:00`),
    pricePerSlot: 150000, totalPrice: 150000, status: 'CANCELLED', cancelledAt, cancelledById: userId,
  } });
  await prisma.bookingSlot.create({ data: {
    bookingId: cancelled.id, courtId, startAt: cancelled.startAt, releasedAt: cancelledAt,
  } });
  const response = await request(app).get(`/courts/${courtId}/availability`).query({ date, durationMinutes: 90 });

  expect(response.status).toBe(200);
  const starts = response.body.data.availableStarts.map((interval: { startAt: string }) => interval.startAt);
  expect(starts).toHaveLength(26);
  expect(starts).toContain('2026-11-18T10:30:00.000Z'); // 17:30 -> 19:00.
  expect(starts).toContain('2026-11-18T13:00:00.000Z'); // 20:00 -> 21:30, released slot ignored.
  expect(starts).not.toContain('2026-11-18T11:00:00.000Z'); // 18:00 -> 19:30.
  expect(starts).not.toContain('2026-11-18T11:30:00.000Z'); // 18:30 -> 20:00.
  expect(await prisma.bookingSlot.count({ where: { courtId } })).toBe(3);
});
