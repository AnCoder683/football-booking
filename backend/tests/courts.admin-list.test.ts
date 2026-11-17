import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { app } from '../src/app.js';
import { getJwtAccessSecret } from '../src/config/auth-config.js';
import { prisma } from '../src/lib/prisma.js';

let branchId = '';
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
      name: `Admin list ${randomUUID()}`, address: 'Test address',
      courts: { create: [
        { name: 'Court C', playersPerTeam: 7, pricePerSlot: 150000, isActive: true },
        { name: 'Court A', playersPerTeam: 7, pricePerSlot: 150000, isActive: false },
        { name: 'Court B', playersPerTeam: 5, pricePerSlot: 100000, isActive: false },
      ] },
    },
  });
  branchId = branch.id;
});

afterEach(async () => {
  if (branchId) await prisma.$transaction([
    prisma.court.deleteMany({ where: { branchId } }),
    prisma.branch.delete({ where: { id: branchId } }),
  ]);
});

afterAll(async () => { await prisma.$disconnect(); });

test('ADMIN sees both active and inactive courts in name order by default', async () => {
  const response = await request(app).get('/admin/courts').set('Authorization', `Bearer ${token}`).query({ branchId });

  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    success: true, message: 'Lấy danh sách sân thành công',
    data: [
      { name: 'Court A', isActive: false },
      { name: 'Court B', isActive: false },
      { name: 'Court C', isActive: true },
    ],
    meta: { page: 1, limit: 10, total: 3, totalPages: 1 },
  });
  expect(response.body.data[0]).toEqual({
    id: expect.any(String), name: 'Court A', playersPerTeam: 7, pricePerSlot: 150000, isActive: false,
    branch: { id: branchId, name: expect.any(String), address: 'Test address' },
  });
});

test.each(['true', 'false'])('combines branch, team size and isActive=%s with AND', async isActive => {
  const response = await request(app).get('/admin/courts').set('Authorization', `Bearer ${token}`)
    .query({ branchId, playersPerTeam: '7', isActive });

  expect(response.status).toBe(200);
  expect(response.body.data).toHaveLength(1);
  expect(response.body.data[0]).toMatchObject({
    name: isActive === 'true' ? 'Court C' : 'Court A', isActive: isActive === 'true',
    playersPerTeam: 7, branch: { id: branchId },
  });
  expect(response.body.meta).toEqual({ page: 1, limit: 10, total: 1, totalPages: 1 });
});

test.each(['missing', 'CUSTOMER'])('rejects %s authorization before query validation', async role => {
  const call = request(app).get('/admin/courts').query({ page: '0', isActive: 'invalid' });
  if (role === 'CUSTOMER') {
    const customerToken = jwt.sign({ role }, getJwtAccessSecret(), { subject: randomUUID(), expiresIn: 900 });
    call.set('Authorization', `Bearer ${customerToken}`);
  }
  const response = await call;

  expect(response.status).toBe(role === 'missing' ? 401 : 403);
  expect(response.body.error.code).toBe(role === 'missing' ? 'UNAUTHENTICATED' : 'FORBIDDEN');
});

test('rejects isActive values other than the exact strings true and false', async () => {
  const response = await request(app).get('/admin/courts').set('Authorization', `Bearer ${token}`)
    .query({ isActive: 'False' });

  expect(response.status).toBe(400);
  expect(response.body.error).toEqual({
    code: 'VALIDATION_ERROR', message: 'Dữ liệu không hợp lệ.',
    details: [{ field: 'isActive', message: 'isActive chỉ nhận true hoặc false.' }],
  });
});

test('returns an empty list for a valid but missing branch', async () => {
  const response = await request(app).get('/admin/courts').set('Authorization', `Bearer ${token}`)
    .query({ branchId: randomUUID() });

  expect(response.status).toBe(200);
  expect(response.body.data).toEqual([]);
  expect(response.body.meta).toEqual({ page: 1, limit: 10, total: 0, totalPages: 0 });
});

test('paginates after filtering while total includes both states', async () => {
  const response = await request(app).get('/admin/courts').set('Authorization', `Bearer ${token}`)
    .query({ branchId, page: 2, limit: 1 });

  expect(response.status).toBe(200);
  expect(response.body.data).toHaveLength(1);
  expect(response.body.data[0]).toMatchObject({ name: 'Court B', isActive: false });
  expect(response.body.meta).toEqual({ page: 2, limit: 1, total: 3, totalPages: 3 });
});

test('public courts still return only active courts even when isActive=false is supplied', async () => {
  const response = await request(app).get('/courts').query({ branchId, isActive: 'false' });

  expect(response.status).toBe(200);
  expect(response.body.data).toHaveLength(1);
  expect(response.body.data[0]).toMatchObject({ name: 'Court C', isActive: true });
  expect(response.body.meta).toEqual({ page: 1, limit: 10, total: 1, totalPages: 1 });
});
