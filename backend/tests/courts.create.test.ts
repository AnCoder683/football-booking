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
    data: { name: `Create court ${randomUUID()}`, address: 'Test address' },
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

test.each([undefined, false])('ADMIN creates a court with isActive input %s', async isActive => {
  const response = await request(app).post('/admin/courts').set('Authorization', `Bearer ${token}`)
    .send({ branchId, name: '  Sân\t A  ', playersPerTeam: 7, pricePerSlot: 150000, isActive });

  expect(response.status).toBe(201);
  expect(response.body).toEqual({
    success: true,
    message: 'Tạo sân thành công',
    data: {
      id: expect.any(String), name: 'Sân A', playersPerTeam: 7,
      pricePerSlot: 150000, isActive: isActive ?? true,
      branch: { id: branchId, name: expect.any(String), address: 'Test address' },
    },
  });
  const court = await prisma.court.findUnique({ where: { id: response.body.data.id } });
  expect(court).toMatchObject({ branchId, name: 'Sân A', isActive: isActive ?? true, pricePerSlot: 150000 });
  expect(await prisma.court.count({ where: { branchId } })).toBe(1);
});

test.each(['missing', 'CUSTOMER'])('rejects %s authorization before body validation', async role => {
  const call = request(app).post('/admin/courts');
  if (role === 'CUSTOMER') {
    const customerToken = jwt.sign({ role }, getJwtAccessSecret(), { subject: randomUUID(), expiresIn: 900 });
    call.set('Authorization', `Bearer ${customerToken}`);
  }
  const response = await call.send({});

  expect(response.status).toBe(role === 'missing' ? 401 : 403);
  expect(response.body.error.code).toBe(role === 'missing' ? 'UNAUTHENTICATED' : 'FORBIDDEN');
  expect(await prisma.court.count({ where: { branchId } })).toBe(0);
});

test('rejects invalid fields and reports the extra field by name', async () => {
  const response = await request(app).post('/admin/courts').set('Authorization', `Bearer ${token}`)
    .send({ branchId: 'invalid', name: '  ', playersPerTeam: 6, pricePerSlot: 0, isActive: 'false', address: 'Extra' });

  expect(response.status).toBe(400);
  expect(response.body.error.code).toBe('VALIDATION_ERROR');
  expect(response.body.error.details.map((detail: { field: string }) => detail.field).sort())
    .toEqual(['address', 'branchId', 'isActive', 'name', 'playersPerTeam', 'pricePerSlot']);
  expect(await prisma.court.count({ where: { branchId } })).toBe(0);
});

test('returns 404 when the branch does not exist', async () => {
  const missingBranchId = randomUUID();
  const response = await request(app).post('/admin/courts').set('Authorization', `Bearer ${token}`)
    .send({ branchId: missingBranchId, name: 'Sân A', playersPerTeam: 5, pricePerSlot: 150000 });

  expect(response.status).toBe(404);
  expect(response.body.error.code).toBe('BRANCH_NOT_FOUND');
  expect(await prisma.court.count({ where: { branchId: missingBranchId } })).toBe(0);
});

test('returns 409 for a normalized name matching an inactive court', async () => {
  await prisma.court.create({ data: { branchId, name: 'Sân A', playersPerTeam: 5, pricePerSlot: 100000, isActive: false } });
  const response = await request(app).post('/admin/courts').set('Authorization', `Bearer ${token}`)
    .send({ branchId, name: '  sÂn\t a  ', playersPerTeam: 7, pricePerSlot: 150000 });

  expect(response.status).toBe(409);
  expect(response.body.error).toEqual({
    code: 'COURT_NAME_CONFLICT',
    message: 'Tên sân đã tồn tại trong chi nhánh này. Vui lòng chọn tên khác.',
  });
  const courts = await prisma.court.findMany({ where: { branchId } });
  expect(courts).toHaveLength(1);
  expect(courts[0]).toMatchObject({ name: 'Sân A', isActive: false, playersPerTeam: 5, pricePerSlot: 100000 });
});

test('concurrent requests with the same normalized name create only one court', async () => {
  const responses = await Promise.all([' Sân  A ', 'sân a'].map(name =>
    request(app).post('/admin/courts').set('Authorization', `Bearer ${token}`)
      .send({ branchId, name, playersPerTeam: 11, pricePerSlot: 200000 }),
  ));

  expect(responses.map(response => response.status).sort()).toEqual([201, 409]);
  expect(responses.find(response => response.status === 409)?.body.error.code).toBe('COURT_NAME_CONFLICT');
  expect(await prisma.court.count({ where: { branchId } })).toBe(1);
});
