import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { app } from '../src/app.js';
import { getJwtAccessSecret } from '../src/config/auth-config.js';
import { prisma } from '../src/lib/prisma.js';

let branchId = '';
let courtId: string;
let token: string;

beforeAll(async () => {
  expect(process.env.NODE_ENV).toBe('test');
  const databases = await prisma.$queryRaw<{ name: string }[]>`SELECT current_database() AS name`;
  expect(databases[0].name).toBe('football_booking_test');
  token = jwt.sign({ role: 'ADMIN' }, getJwtAccessSecret(), { subject: randomUUID(), expiresIn: 900 });
});

beforeEach(async () => {
  branchId = '';
  const branch = await prisma.branch.create({
    data: {
      name: `Update court ${randomUUID()}`, address: 'Test address',
      courts: { create: { name: 'Sân A', playersPerTeam: 7, pricePerSlot: 150000, isActive: false } },
    },
    include: { courts: true },
  });
  branchId = branch.id;
  courtId = branch.courts[0].id;
});

afterEach(async () => {
  if (branchId) await prisma.$transaction([
    prisma.court.deleteMany({ where: { branchId } }),
    prisma.branch.delete({ where: { id: branchId } }),
  ]);
});

afterAll(async () => { await prisma.$disconnect(); });

test('ADMIN updates all editable fields and returns saved court and branch', async () => {
  const response = await request(app).patch(`/admin/courts/${courtId}`).set('Authorization', `Bearer ${token}`)
    .send({ name: '  Sân\t B  ', playersPerTeam: 11, pricePerSlot: 200000, isActive: true });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    success: true, message: 'Cập nhật sân thành công',
    data: {
      id: courtId, name: 'Sân B', playersPerTeam: 11, pricePerSlot: 200000, isActive: true,
      branch: { id: branchId, name: expect.any(String), address: 'Test address' },
    },
  });
  const court = await prisma.court.findUnique({ where: { id: courtId } });
  expect(court).toMatchObject({ branchId, name: 'Sân B', playersPerTeam: 11, pricePerSlot: 200000, isActive: true });
});

test('accepts the same normalized name and preserves omitted fields including inactive status', async () => {
  const response = await request(app).patch(`/admin/courts/${courtId}`).set('Authorization', `Bearer ${token}`)
    .send({ name: ' Sân  A ', pricePerSlot: 180000 });

  expect(response.status).toBe(200);
  const court = await prisma.court.findUnique({ where: { id: courtId } });
  expect(court).toMatchObject({ branchId, name: 'Sân A', playersPerTeam: 7, pricePerSlot: 180000, isActive: false });
});

test.each(['missing', 'CUSTOMER'])('rejects %s authorization before ID and body validation', async role => {
  const before = await prisma.court.findUnique({ where: { id: courtId } });
  const call = request(app).patch('/admin/courts/invalid-id');
  if (role === 'CUSTOMER') {
    const customerToken = jwt.sign({ role }, getJwtAccessSecret(), { subject: randomUUID(), expiresIn: 900 });
    call.set('Authorization', `Bearer ${customerToken}`);
  }
  const response = await call.send({});

  expect(response.status).toBe(role === 'missing' ? 401 : 403);
  expect(response.body.error.code).toBe(role === 'missing' ? 'UNAUTHENTICATED' : 'FORBIDDEN');
  expect(await prisma.court.findUnique({ where: { id: courtId } })).toEqual(before);
});

test.each([
  { description: 'invalid UUID', invalidId: true, body: { pricePerSlot: 200000 }, fields: ['courtId'] },
  { description: 'empty body', body: {}, fields: [''] },
  { description: 'null and invalid values', body: { name: null, playersPerTeam: 6, pricePerSlot: 0, isActive: null }, fields: ['name', 'playersPerTeam', 'pricePerSlot', 'isActive'] },
  { description: 'branch change and extra field', body: { branchId: randomUUID(), address: 'Extra', pricePerSlot: 200000 }, fields: ['branchId', 'address'] },
])('rejects $description without changing the court', async ({ invalidId, body, fields }) => {
  const before = await prisma.court.findUnique({ where: { id: courtId } });
  const response = await request(app).patch(`/admin/courts/${invalidId ? 'invalid' : courtId}`)
    .set('Authorization', `Bearer ${token}`).send(body);

  expect(response.status).toBe(400);
  expect(response.body.error.code).toBe('VALIDATION_ERROR');
  expect(response.body.error.details.map((detail: { field: string }) => detail.field).sort()).toEqual([...fields].sort());
  expect(await prisma.court.findUnique({ where: { id: courtId } })).toEqual(before);
});

test('returns 404 for a missing court', async () => {
  const response = await request(app).patch(`/admin/courts/${randomUUID()}`)
    .set('Authorization', `Bearer ${token}`).send({ isActive: false });

  expect(response.status).toBe(404);
  expect(response.body.error.code).toBe('COURT_NOT_FOUND');
  expect(await prisma.court.count({ where: { branchId } })).toBe(1);
});

test('a name conflicting with an inactive court returns 409 and leaves all fields unchanged', async () => {
  await prisma.court.create({ data: { branchId, name: 'Sân B', playersPerTeam: 5, pricePerSlot: 100000, isActive: false } });
  const before = await prisma.court.findUnique({ where: { id: courtId } });
  const response = await request(app).patch(`/admin/courts/${courtId}`).set('Authorization', `Bearer ${token}`)
    .send({ name: ' sÂn\t b ', playersPerTeam: 11, pricePerSlot: 250000, isActive: true });

  expect(response.status).toBe(409);
  expect(response.body.error.code).toBe('COURT_NAME_CONFLICT');
  expect(await prisma.court.findUnique({ where: { id: courtId } })).toEqual(before);
});

test('concurrent renames to one normalized name allow only one update and preserve the losing court', async () => {
  const otherCourt = await prisma.court.create({
    data: { branchId, name: 'Sân B', playersPerTeam: 5, pricePerSlot: 100000, isActive: false },
  });
  const before = await prisma.court.findMany({ where: { branchId } });
  const ids = [courtId, otherCourt.id];
  const responses = await Promise.all(ids.map((id, index) =>
    request(app).patch(`/admin/courts/${id}`).set('Authorization', `Bearer ${token}`)
      .send({ name: index === 0 ? ' Sân  C ' : 'sân c', pricePerSlot: 250000, isActive: true }),
  ));

  expect(responses.map(response => response.status).sort()).toEqual([200, 409]);
  const loserIndex = responses.findIndex(response => response.status === 409);
  expect(responses[loserIndex].body.error.code).toBe('COURT_NAME_CONFLICT');
  expect(await prisma.court.findUnique({ where: { id: ids[loserIndex] } }))
    .toEqual(before.find(court => court.id === ids[loserIndex]));
  const winnerId = ids[1 - loserIndex];
  expect(await prisma.court.findUnique({ where: { id: winnerId } }))
    .toMatchObject({ pricePerSlot: 250000, isActive: true });
  expect(await prisma.court.count({ where: { branchId } })).toBe(2);
});
