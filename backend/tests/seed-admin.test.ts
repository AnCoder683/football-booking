import { execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { promisify } from 'node:util';
import bcrypt from 'bcrypt';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';
import { prisma } from '../src/lib/prisma.js';

const run = promisify(execFile);
const password = 'Seed test password 123!';
let email: string;

beforeAll(async () => {
  expect(process.env.NODE_ENV).toBe('test');
  const databases = await prisma.$queryRaw<{ name: string }[]>`SELECT current_database() AS name`;
  expect(databases[0].name).toBe('football_booking_test');
});

beforeEach(() => {
  email = `seed-admin-${randomUUID()}@example.com`;
});

afterEach(async () => {
  await prisma.user.deleteMany({ where: { email } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('creates an admin with a hashed password and preserves it on rerun', async () => {
  const env = { ...process.env, ADMIN_EMAIL: `  ${email.toUpperCase()}  `, ADMIN_PASSWORD: password };

  await run(process.execPath, ['--import', 'tsx', 'src/scripts/seed-admin.ts'], { env });

  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  expect(user.role).toBe('ADMIN');
  expect(user.name).toBe('Admin');
  expect(await bcrypt.compare(password, user.passwordHash)).toBe(true);
  expect(bcrypt.getRounds(user.passwordHash)).toBe(12);

  await run(process.execPath, ['--import', 'tsx', 'src/scripts/seed-admin.ts'], {
    env: { ...env, ADMIN_PASSWORD: 'A different password 456!' },
  });

  const unchanged = await prisma.user.findUniqueOrThrow({ where: { email } });
  expect(unchanged).toEqual(user);
});

test('rejects an existing customer without changing the account', async () => {
  const customer = await prisma.user.create({
    data: { name: 'Customer', email, passwordHash: 'not-used-for-login' },
  });

  await expect(run(process.execPath, ['--import', 'tsx', 'src/scripts/seed-admin.ts'], {
    env: { ...process.env, ADMIN_EMAIL: email, ADMIN_PASSWORD: password },
  })).rejects.toMatchObject({ code: 1 });

  expect(await prisma.user.findUnique({ where: { email } })).toEqual(customer);
});

test('rejects missing password without creating an account', async () => {
  await expect(run(process.execPath, ['--import', 'tsx', 'src/scripts/seed-admin.ts'], {
    env: { ...process.env, ADMIN_EMAIL: email, ADMIN_PASSWORD: '' },
  })).rejects.toMatchObject({ code: 1 });

  expect(await prisma.user.findUnique({ where: { email } })).toBeNull();
});
