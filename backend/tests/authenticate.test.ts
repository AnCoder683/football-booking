import { randomUUID } from 'node:crypto';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { expect, test } from 'vitest';
import { getJwtAccessSecret } from '../src/config/auth-config.js';
import { authenticate } from '../src/middlewares/authenticate.js';
import { authorize } from '../src/middlewares/authorize.js';

const app = express();
app.get('/protected', authenticate, (_req, res) => res.json({ userId: res.locals.userId, role: res.locals.role }));
app.get('/admin-test', authenticate, authorize('ADMIN'), (_req, res) => res.sendStatus(204));
const userId = randomUUID();

test('passes the verified JWT subject and role to the next handler', async () => {
  const token = jwt.sign({ role: 'CUSTOMER' }, getJwtAccessSecret(), { algorithm: 'HS256', subject: userId, expiresIn: 900 });
  const response = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ userId, role: 'CUSTOMER' });
});

test('allows an admin to reach the protected admin handler', async () => {
  const token = jwt.sign({ role: 'ADMIN' }, getJwtAccessSecret(), { subject: userId, expiresIn: 900 });

  const response = await request(app).get('/admin-test').set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(204);
});

test('rejects a customer from the protected admin handler', async () => {
  const token = jwt.sign({ role: 'CUSTOMER' }, getJwtAccessSecret(), { subject: userId, expiresIn: 900 });

  const response = await request(app).get('/admin-test').set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(403);
  expect(response.body.error.code).toBe('FORBIDDEN');
});

test.each([undefined, 'OWNER'])('rejects a signed JWT with invalid role %s', async role => {
  const token = jwt.sign({ role }, getJwtAccessSecret(), { subject: userId, expiresIn: 900 });

  const response = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(401);
  expect(response.body.error.code).toBe('UNAUTHENTICATED');
});

test.each([
  ['missing', undefined],
  ['wrong scheme', 'Basic abc'],
  ['malformed', 'Bearer abc'],
  ['extra token', 'Bearer abc def'],
  ['wrong signature', `Bearer ${jwt.sign({ role: 'CUSTOMER' }, 'another-test-secret', { subject: userId, expiresIn: 900 })}`],
  ['expired', `Bearer ${jwt.sign({ role: 'CUSTOMER' }, getJwtAccessSecret(), { subject: userId, expiresIn: -1 })}`],
  ['wrong algorithm', `Bearer ${jwt.sign({ role: 'CUSTOMER' }, getJwtAccessSecret(), { algorithm: 'HS384', subject: userId, expiresIn: 900 })}`],
  ['missing expiry', `Bearer ${jwt.sign({ role: 'CUSTOMER' }, getJwtAccessSecret(), { subject: userId })}`],
  ['missing subject', `Bearer ${jwt.sign({ role: 'CUSTOMER' }, getJwtAccessSecret(), { expiresIn: 900 })}`],
  ['empty subject', `Bearer ${jwt.sign({ role: 'CUSTOMER' }, getJwtAccessSecret(), { subject: '', expiresIn: 900 })}`],
])('rejects %s access token', async (_name, authorization) => {
  const call = request(app).get('/protected');
  if (authorization) call.set('Authorization', authorization);
  const response = await call;
  expect(response.status).toBe(401);
  expect(response.body).toEqual({
    success: false,
    error: { code: 'UNAUTHENTICATED', message: 'Vui lòng đăng nhập để tiếp tục.' },
  });
});
