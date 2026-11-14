import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { app } from '../src/app.js';
import { getJwtAccessSecret } from '../src/config/auth-config.js';
import { prisma } from '../src/lib/prisma.js';

let userId: string;
let email: string;
let token: string;

beforeAll(async () => {
  expect(process.env.NODE_ENV).toBe('test');
  const databases = await prisma.$queryRaw<{ name: string }[]>`SELECT current_database() AS name`;
  expect(databases[0].name).toBe('football_booking_test');
});

beforeEach(async () => {
  email = `me-${randomUUID()}@example.com`;
  const user = await prisma.user.create({
    data: { name: 'Me Test', email, passwordHash: 'not-used-for-login' },
  });
  userId = user.id;
  token = jwt.sign({ role: 'CUSTOMER' }, getJwtAccessSecret(), {
    algorithm: 'HS256', subject: userId, expiresIn: 900,
  });
});

afterEach(async () => {
  if (email) await prisma.user.deleteMany({ where: { email } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

test.each(['CUSTOMER', 'ADMIN'] as const)('returns current database fields for %s without a refresh cookie', async role => {
  await prisma.user.update({
    where: { id: userId },
    data: { name: 'Updated Name', role, isBookingBlocked: true },
  });
  const response = await request(app).get('/auth/me')
    .query({ userId: randomUUID() })
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.headers['cache-control']).toBe('no-store');
  expect(response.body).toEqual({
    success: true,
    message: 'Lấy thông tin tài khoản thành công',
    data: { id: userId, name: 'Updated Name', email, role, isBookingBlocked: true },
  });
});

test('rejects a valid token after its user is deleted', async () => {
  await prisma.user.delete({ where: { id: userId } });
  const response = await request(app).get('/auth/me').set('Authorization', `Bearer ${token}`);
  expect(response.status).toBe(401);
  expect(response.body.error.code).toBe('UNAUTHENTICATED');
});

test.each(['missing', 'invalid', 'expired'])('rejects a %s access token', async kind => {
  const call = request(app).get('/auth/me');
  if (kind === 'invalid') call.set('Authorization', 'Bearer invalid');
  if (kind === 'expired') {
    const expired = jwt.sign({}, getJwtAccessSecret(), { subject: userId, expiresIn: -1 });
    call.set('Authorization', `Bearer ${expired}`);
  }
  const response = await call;
  expect(response.status).toBe(401);
  expect(response.body.error.code).toBe('UNAUTHENTICATED');
});
