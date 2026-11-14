import { createHash, randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { getAppOrigin, getJwtAccessSecret } from '../src/config/auth-config.js';
import { prisma } from '../src/lib/prisma.js';
import { loginLimiter, registerLimiter } from '../src/modules/auth/auth.routes.js';

const password = '  a long password  ';
let email: string;
let userId: string;
let headers: Record<string, string>;

beforeAll(async () => {
  expect(process.env.NODE_ENV).toBe('test');
  const databases = await prisma.$queryRaw<{ name: string }[]>`SELECT current_database() AS name`;
  expect(databases[0].name).toBe('football_booking_test');
  headers = { Origin: getAppOrigin(), 'X-CSRF-Protection': '1' };
});

beforeEach(async () => {
  loginLimiter.resetKey('127.0.0.1');
  registerLimiter.resetKey('127.0.0.1');
  email = `login-${randomUUID()}@example.com`;
  const user = await prisma.user.create({
    data: { name: 'Login Test', email, passwordHash: await bcrypt.hash(password, 4), isBookingBlocked: true },
  });
  userId = user.id;
});

afterEach(async () => {
  if (email) await prisma.user.deleteMany({ where: { email } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

test.each(['CUSTOMER', 'ADMIN'] as const)('login returns the correct user for %s', async role => {
  await prisma.user.update({ where: { id: userId }, data: { role } });
  const response = await request(app).post('/auth/login').set(headers)
    .send({ email: `  ${email.toUpperCase()}  `, password });
  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    success: true,
    message: 'Đăng nhập thành công',
    data: {
      accessToken: expect.any(String), tokenType: 'Bearer', expiresIn: 900,
      user: { id: userId, name: 'Login Test', email, role, isBookingBlocked: true },
    },
  });
  expect(response.headers['cache-control']).toBe('no-store');
});

test.each(['CUSTOMER', 'ADMIN'] as const)('login issues a valid access JWT for %s', async role => {
  await prisma.user.update({ where: { id: userId }, data: { role } });

  const response = await request(app).post('/auth/login').set(headers)
    .send({ email, password });
  expect(response.status).toBe(200);

  const payload = jwt.verify(response.body.data.accessToken, getJwtAccessSecret(), { algorithms: ['HS256'] });
  if (typeof payload === 'string') throw new Error('Expected JWT object payload');
  expect(payload.sub).toBe(userId);
  expect(payload.role).toBe(role);
  expect(payload.exp! - payload.iat!).toBe(900);
});

test('login sets a refresh cookie with the required attributes', async () => {
  const response = await request(app).post('/auth/login').set(headers)
    .send({ email, password });
  expect(response.status).toBe(200);

  const cookie = response.headers['set-cookie'][0] as string;
  expect(cookie).toContain('HttpOnly');
  expect(cookie).toContain('SameSite=Lax');
  expect(cookie).toContain('Path=/');
  expect(cookie).not.toContain('Domain=');
  expect(cookie).not.toContain('Secure');

  const token = cookie.split(';')[0].slice('refreshToken='.length);
  expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
  expect(Buffer.from(token, 'base64url')).toHaveLength(32);
});

test('login saves one hashed refresh session that expires in seven days', async () => {
  const before = Date.now();
  const response = await request(app).post('/auth/login').set(headers)
    .send({ email, password });
  const after = Date.now();
  expect(response.status).toBe(200);

  const cookie = response.headers['set-cookie'][0] as string;
  const token = cookie.split(';')[0].slice('refreshToken='.length);
  const expectedHash = createHash('sha256').update(token).digest('hex');

  const sessions = await prisma.refreshToken.findMany({ where: { userId } });
  expect(sessions).toHaveLength(1);
  const session = sessions[0]!;
  expect(session.tokenHash).toBe(expectedHash);
  expect(session.familyId).toMatch(/^[0-9a-f-]{36}$/);
  expect(session.usedAt).toBeNull();
  expect(session.revokedAt).toBeNull();

  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const expiresAt = session.expiresAt.getTime();
  expect(expiresAt).toBeGreaterThanOrEqual(before + sevenDays);
  expect(expiresAt).toBeLessThanOrEqual(after + sevenDays);
  expect(cookie).toContain(`Expires=${session.expiresAt.toUTCString()}`);
});

test('wrong password and absent email return the same 401 without cookies or sessions', async () => {
  for (const body of [{ email, password: 'wrong' }, { email: `absent-${email}`, password }]) {
    const response = await request(app).post('/auth/login').set(headers).send(body);
    expect(response.status).toBe(401);
    expect(response.body.error).toEqual({ code: 'INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không đúng.' });
    expect(response.headers['set-cookie']).toBeUndefined();
  }
  expect(await prisma.refreshToken.count({ where: { userId } })).toBe(0);
});

test('CSRF rejects untrusted requests before creating sessions or counting login attempts', async () => {
  for (const source of [
    {},
    { Origin: headers.Origin },
    { Origin: 'https://evil.example', 'X-CSRF-Protection': '1' },
    { Origin: 'null', Referer: `${headers.Origin}/login`, 'X-CSRF-Protection': '1' },
    { Origin: 'https://evil.example', Referer: `${headers.Origin}/login`, 'X-CSRF-Protection': '1' },
    { Referer: 'invalid', 'X-CSRF-Protection': '1' },
  ]) {
    const response = await request(app).post('/auth/login').set(source).send({ email, password });
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('CSRF_VALIDATION_FAILED');
    expect(response.headers['set-cookie']).toBeUndefined();
  }
  expect(await prisma.refreshToken.count({ where: { userId } })).toBe(0);
  const response = await request(app).post('/auth/login')
    .set({ Referer: `${headers.Origin}/login`, 'X-CSRF-Protection': '1' }).send({ email, password });
  expect(response.status).toBe(200);
});

test('login rejects invalid JSON bodies and form/text input without creating sessions', async () => {
  for (const body of [{}, { email, password: '' }, { email, password, role: 'ADMIN' }]) {
    const response = await request(app).post('/auth/login').set(headers).send(body);
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.headers['set-cookie']).toBeUndefined();
  }
  for (const type of ['form', 'text']) {
    const response = await request(app).post('/auth/login').set(headers).type(type)
      .send(`email=${email}&password=${password}`);
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.headers['set-cookie']).toBeUndefined();
  }
  expect(await prisma.refreshToken.count({ where: { userId } })).toBe(0);
});

test('login counts successes, failures and invalid bodies; request six gets 429 independently of registration', async () => {
  const success = await request(app).post('/auth/login').set(headers).send({ email, password });
  expect(success.status).toBe(200);
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await request(app).post('/auth/login').set(headers).send({ email, password: 'wrong' });
    expect(response.status).toBe(401);
  }
  const invalid = await request(app).post('/auth/login').set(headers).send({});
  expect(invalid.status).toBe(400);
  const limited = await request(app).post('/auth/login').set(headers).send({ email, password });
  expect(limited.status).toBe(429);
  expect(limited.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
  expect(Number(limited.headers['retry-after'])).toBeGreaterThan(0);
  expect(limited.headers['set-cookie']).toBeUndefined();
  expect(await prisma.refreshToken.count({ where: { userId } })).toBe(1);
  const registration = await request(app).post('/auth/register').send({});
  expect(registration.status).toBe(400);
});

test('separate logins create separate refresh families', async () => {
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await request(app).post('/auth/login').set(headers).send({ email, password });
    expect(response.status).toBe(200);
  }
  const sessions = await prisma.refreshToken.findMany({ where: { userId } });
  expect(sessions).toHaveLength(2);
  expect(sessions[0]!.familyId).not.toBe(sessions[1]!.familyId);
  expect(sessions[0]!.tokenHash).not.toBe(sessions[1]!.tokenHash);
});
