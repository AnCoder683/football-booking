import { randomUUID } from 'node:crypto';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { expect, test } from 'vitest';
import { getJwtAccessSecret } from '../src/config/auth-config.js';
import { authenticate } from '../src/middlewares/authenticate.js';

const app = express();
app.get('/protected', authenticate, (_req, res) => res.json({ userId: res.locals.userId }));
const userId = randomUUID();

test('passes the verified JWT subject to the next handler', async () => {
  const token = jwt.sign({}, getJwtAccessSecret(), { algorithm: 'HS256', subject: userId, expiresIn: 900 });
  const response = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ userId });
});

test.each([
  ['missing', undefined],
  ['wrong scheme', 'Basic abc'],
  ['malformed', 'Bearer abc'],
  ['extra token', 'Bearer abc def'],
  ['wrong signature', `Bearer ${jwt.sign({}, 'another-test-secret', { subject: userId, expiresIn: 900 })}`],
  ['expired', `Bearer ${jwt.sign({}, getJwtAccessSecret(), { subject: userId, expiresIn: -1 })}`],
  ['wrong algorithm', `Bearer ${jwt.sign({}, getJwtAccessSecret(), { algorithm: 'HS384', subject: userId, expiresIn: 900 })}`],
  ['missing expiry', `Bearer ${jwt.sign({}, getJwtAccessSecret(), { subject: userId })}`],
  ['missing subject', `Bearer ${jwt.sign({}, getJwtAccessSecret(), { expiresIn: 900 })}`],
  ['empty subject', `Bearer ${jwt.sign({}, getJwtAccessSecret(), { subject: '', expiresIn: 900 })}`],
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
