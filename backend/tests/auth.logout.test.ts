import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { getAppOrigin } from '../src/config/auth-config.js';
import { prisma } from '../src/lib/prisma.js';
import { loginLimiter } from '../src/modules/auth/auth.routes.js';

const password = 'logout test password';
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
  email = `logout-${randomUUID()}@example.com`;
  const user = await prisma.user.create({
    data: { name: 'Logout Test', email, passwordHash: await bcrypt.hash(password, 4) },
  });
  userId = user.id;
});

afterEach(async () => {
  if (email) await prisma.user.deleteMany({ where: { email } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('logout clears the cookie and revokes the refresh session', async () => {
  // Chuẩn bị: login để agent nhận cookie refresh.
  const agent = request.agent(app);
  const loginResponse = await agent.post('/auth/login').set(headers).send({ email, password });
  expect(loginResponse.status).toBe(200);
  const sessionBeforeLogout = await prisma.refreshToken.findFirstOrThrow({ where: { userId } });
  expect(sessionBeforeLogout.revokedAt).toBeNull();

  // Gọi API: dùng cookie agent đã nhớ, không cần Authorization hoặc body.
  const response = await agent.post('/auth/logout').set(headers);

  // Kiểm tra: response rỗng, cookie hết hạn và phiên trong DB bị thu hồi.
  expect(response.status).toBe(204);
  expect(response.text).toBe('');
  const clearedCookie = response.headers['set-cookie'][0] as string;
  expect(clearedCookie).toContain('refreshToken=;');
  expect(clearedCookie).toContain('Expires=Thu, 01 Jan 1970');

  const sessionAfterLogout = await prisma.refreshToken.findUniqueOrThrow({
    where: { id: sessionBeforeLogout.id },
  });
  expect(sessionAfterLogout.revokedAt).toBeInstanceOf(Date);
  expect(sessionAfterLogout.usedAt).toBeNull();
});
