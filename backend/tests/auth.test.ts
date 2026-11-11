import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { registerLimiter } from '../src/modules/auth/auth.routes.js';

let email: string;
const password = '  a long password  ';

beforeAll(async () => {
  expect(process.env.NODE_ENV).toBe('test');
  const databases = await prisma.$queryRaw<{ name: string }[]>`
    SELECT current_database() AS name
  `;
  expect(databases[0].name).toBe('football_booking_test');
});

beforeEach(() => {
  email = `register-${randomUUID()}@example.com`;
  // Supertest uses loopback; each test starts with a fresh request allowance.
  registerLimiter.resetKey('127.0.0.1');
});

afterEach(async () => {
  if (email) {
    await prisma.user.deleteMany({ where: { email } });
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('POST /auth/register creates a customer with a hashed password and public response', async () => {
  const response = await request(app).post('/auth/register').send({
    name: '  Nguyễn   An  ',
    email: `  ${email.toUpperCase()}  `,
    password,
  });

  expect(response.status).toBe(201);
  expect(response.body).toEqual({
    success: true,
    message: 'Đăng ký thành công. Vui lòng đăng nhập.',
    data: {
      id: expect.any(String),
      name: 'Nguyễn An',
      email,
      role: 'CUSTOMER',
      isBookingBlocked: false,
      createdAt: expect.any(String),
    },
  });
  expect(response.headers['set-cookie']).toBeUndefined();

  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  expect(user.id).toBe(response.body.data.id);
  expect(user.role).toBe('CUSTOMER');
  expect(user.isBookingBlocked).toBe(false);
  expect(user.createdAt.toISOString()).toBe(response.body.data.createdAt);
  expect(user.passwordHash).not.toBe(password);
  expect(await bcrypt.compare(password, user.passwordHash)).toBe(true);
  expect(await bcrypt.compare(password.trim(), user.passwordHash)).toBe(false);
});

test.each(['CUSTOMER', 'ADMIN'] as const)(
  'POST /auth/register rejects an email already owned by a %s',
  async (role) => {
    await prisma.user.create({
      data: {
        name: 'Existing user',
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role,
      },
    });

    const response = await request(app).post('/auth/register').send({
      name: 'New user',
      email: `  ${email.toUpperCase()}  `,
      password,
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Email đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.',
      },
    });
    expect(await prisma.user.count({ where: { email } })).toBe(1);
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    expect(user.name).toBe('Existing user');
    expect(user.role).toBe(role);
  },
);

test('POST /auth/register creates only one user for concurrent requests with the same email', async () => {
  const body = { name: 'New user', email, password };
  const responses = await Promise.all([
    request(app).post('/auth/register').send(body),
    request(app).post('/auth/register').send(body),
  ]);

  expect(responses.map(response => response.status).sort()).toEqual([201, 409]);
  const conflict = responses.find(response => response.status === 409);
  expect(conflict?.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  expect(await prisma.user.count({ where: { email } })).toBe(1);
});

test.each([{ password: 'short' }, { role: 'ADMIN' }])(
  'POST /auth/register rejects invalid input without creating a user: %j',
  async (fields) => {
    const response = await request(app).post('/auth/register').send({
      name: 'New user', email, password, ...fields,
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      error: { code: 'VALIDATION_ERROR', details: expect.any(Array) },
    });
    expect(await prisma.user.count({ where: { email } })).toBe(0);
  },
);

test('POST /auth/register rejects malformed JSON', async () => {
  const response = await request(app).post('/auth/register')
    .set('Content-Type', 'application/json').send('{');

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    success: false,
    error: { code: 'INVALID_JSON', message: 'Nội dung JSON không hợp lệ.' },
  });
  expect(await prisma.user.count({ where: { email } })).toBe(0);
});

test('POST /auth/register rejects a body larger than the JSON limit', async () => {
  const response = await request(app).post('/auth/register').send({
    name: 'a'.repeat(110 * 1024), email, password,
  });

  expect(response.status).toBe(413);
  expect(response.body).toEqual({
    success: false,
    error: { code: 'PAYLOAD_TOO_LARGE', message: 'Nội dung yêu cầu quá lớn.' },
  });
  expect(await prisma.user.count({ where: { email } })).toBe(0);
});

test('POST /auth/register blocks the sixth request from the same IP', async () => {
  for (let i = 0; i < 5; i++) {
    const response = await request(app).post('/auth/register').send({ email });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  }

  const response = await request(app).post('/auth/register').send({ email });
  expect(response.status).toBe(429);
  expect(response.body).toEqual({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Bạn đã gửi quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau.',
    },
  });
  expect(Number(response.headers['retry-after'])).toBeGreaterThan(0);
  expect(await prisma.user.count({ where: { email } })).toBe(0);
});
