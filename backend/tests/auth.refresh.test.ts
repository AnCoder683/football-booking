import { createHash, randomBytes, randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { getAppOrigin, getJwtAccessSecret } from '../src/config/auth-config.js';
import { prisma } from '../src/lib/prisma.js';
import { loginLimiter } from '../src/modules/auth/auth.routes.js';

const password = 'refresh test password';
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
  email = `refresh-${randomUUID()}@example.com`;
  const user = await prisma.user.create({
    data: { name: 'Refresh Test', email, passwordHash: await bcrypt.hash(password, 4) },
  });
  userId = user.id;
});

afterEach(async () => {
  // Xóa User riêng của test; FK CASCADE dọn các refresh token của User này.
  if (email) await prisma.user.deleteMany({ where: { email } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('refresh rejects a request without the CSRF header and leaves the session unchanged', async () => {
  // Chuẩn bị: login hợp lệ để agent nhận cookie refresh.
  const agent = request.agent(app);
  const loginResponse = await agent.post('/auth/login').set(headers).send({ email, password });
  expect(loginResponse.status).toBe(200);
  const sessionBeforeRequest = await prisma.refreshToken.findFirstOrThrow({ where: { userId } });

  // Gọi API: có cookie và Origin đúng, chỉ thiếu X-CSRF-Protection.
  const response = await agent.post('/auth/refresh').set('Origin', getAppOrigin()).send({});

  // Kiểm tra: bị chặn trước rotation, không cấp cookie mới hoặc sửa DB.
  expect(response.status).toBe(403);
  expect(response.body).toEqual({
    success: false,
    error: {
      code: 'CSRF_VALIDATION_FAILED',
      message: 'Nguồn yêu cầu không hợp lệ.',
    },
  });
  expect(response.headers['set-cookie']).toBeUndefined();
  const sessionsAfterRequest = await prisma.refreshToken.findMany({ where: { userId } });
  expect(sessionsAfterRequest).toEqual([sessionBeforeRequest]);
});

test('refresh rejects an untrusted origin and leaves the session unchanged', async () => {
  // Chuẩn bị: login hợp lệ để agent nhận cookie refresh.
  const agent = request.agent(app);
  const loginResponse = await agent.post('/auth/login').set(headers).send({ email, password });
  expect(loginResponse.status).toBe(200);
  const sessionBeforeRequest = await prisma.refreshToken.findFirstOrThrow({ where: { userId } });

  // Gọi API: có cookie và X-CSRF-Protection đúng, nhưng Origin khác nguồn cho phép.
  const response = await agent.post('/auth/refresh')
    .set('Origin', 'https://untrusted.example.com')
    .set('X-CSRF-Protection', '1').send({});

  // Kiểm tra: bị chặn trước rotation, không cấp cookie mới hoặc sửa DB.
  expect(response.status).toBe(403);
  expect(response.body).toEqual({
    success: false,
    error: {
      code: 'CSRF_VALIDATION_FAILED',
      message: 'Nguồn yêu cầu không hợp lệ.',
    },
  });
  expect(response.headers['set-cookie']).toBeUndefined();
  const sessionsAfterRequest = await prisma.refreshToken.findMany({ where: { userId } });
  expect(sessionsAfterRequest).toEqual([sessionBeforeRequest]);
});

test('refresh rejects extra JSON fields and leaves the session unchanged', async () => {
  // Chuẩn bị: có cookie refresh hợp lệ và headers CSRF đúng.
  const agent = request.agent(app);
  const loginResponse = await agent.post('/auth/login').set(headers).send({ email, password });
  expect(loginResponse.status).toBe(200);
  const sessionBeforeRequest = await prisma.refreshToken.findFirstOrThrow({ where: { userId } });

  // Gọi API: body chỉ được là object rỗng, không nhận refreshToken từ JSON.
  const response = await agent.post('/auth/refresh').set(headers)
    .send({ refreshToken: 'token-in-body-is-not-accepted' });

  // Kiểm tra: validation từ chối trước rotation, DB giữ nguyên phiên.
  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe('VALIDATION_ERROR');
  expect(response.headers['set-cookie']).toBeUndefined();
  const sessionsAfterRequest = await prisma.refreshToken.findMany({ where: { userId } });
  expect(sessionsAfterRequest).toEqual([sessionBeforeRequest]);
});

test('refresh rejects a request without a refresh cookie', async () => {
  // Chuẩn bị: headers CSRF hợp lệ; không login nên request không có cookie.

  // Gọi API.
  const response = await request(app).post('/auth/refresh').set(headers).send({});

  // Kiểm tra: từ chối và không cấp cookie mới.
  expect(response.status).toBe(401);
  expect(response.body).toEqual({
    success: false,
    error: {
      code: 'UNAUTHENTICATED',
      message: 'Không thể gia hạn phiên. Vui lòng đăng nhập lại.',
    },
  });
  expect(response.headers['set-cookie']).toBeUndefined();
  expect(response.headers['cache-control']).toBe('no-store');
});

test('refresh rejects a token that does not exist in the database', async () => {
  // Chuẩn bị: token đúng định dạng nhưng không được backend cấp/lưu.
  const unknownToken = randomBytes(32).toString('base64url');
  const tokenHash = createHash('sha256').update(unknownToken).digest('hex');
  expect(await prisma.refreshToken.findUnique({ where: { tokenHash } })).toBeNull();

  // Gọi API với cookie chứa token không tồn tại và CSRF hợp lệ.
  const response = await request(app).post('/auth/refresh').set(headers)
    .set('Cookie', `refreshToken=${unknownToken}`).send({});

  // Kiểm tra: từ chối, không cấp cookie hoặc lưu token mới cho User test.
  expect(response.status).toBe(401);
  expect(response.body).toEqual({
    success: false,
    error: {
      code: 'UNAUTHENTICATED',
      message: 'Không thể gia hạn phiên. Vui lòng đăng nhập lại.',
    },
  });
  expect(response.headers['set-cookie']).toBeUndefined();
  expect(response.headers['cache-control']).toBe('no-store');
  expect(await prisma.refreshToken.count({ where: { userId } })).toBe(0);
});

test('refresh rejects an expired token without rotating the session', async () => {
  // Chuẩn bị: login nhận cookie rồi cho token hết hạn trong DB test.
  const agent = request.agent(app);
  const loginResponse = await agent.post('/auth/login').set(headers).send({ email, password });
  expect(loginResponse.status).toBe(200);

  const session = await prisma.refreshToken.findFirstOrThrow({ where: { userId } });
  const expiredSession = await prisma.refreshToken.update({
    where: { id: session.id },
    data: { expiresAt: new Date(Date.now() - 1000) },
  });

  // Gọi API bằng cookie đã nhận; không phải chờ token tự hết hạn.
  const response = await agent.post('/auth/refresh').set(headers).send({});

  // Kiểm tra: báo hết hạn, không cấp cookie mới hoặc thay đổi phiên.
  expect(response.status).toBe(401);
  expect(response.body).toEqual({
    success: false,
    error: {
      code: 'REFRESH_TOKEN_EXPIRED',
      message: 'Refresh token đã hết hạn. Vui lòng đăng nhập lại.',
    },
  });
  expect(response.headers['set-cookie']).toBeUndefined();
  expect(response.headers['cache-control']).toBe('no-store');
  const sessions = await prisma.refreshToken.findMany({ where: { userId } });
  expect(sessions).toEqual([expiredSession]);
});

test('refresh rejects a revoked token without rotating the session', async () => {
  // Chuẩn bị: token chưa dùng, còn hạn nhưng đã bị thu hồi.
  const agent = request.agent(app);
  const loginResponse = await agent.post('/auth/login').set(headers).send({ email, password });
  expect(loginResponse.status).toBe(200);

  const session = await prisma.refreshToken.findFirstOrThrow({ where: { userId } });
  expect(session.usedAt).toBeNull();
  expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());
  const revokedSession = await prisma.refreshToken.update({
    where: { id: session.id },
    data: { revokedAt: new Date() },
  });

  // Gọi API bằng cookie của token đã thu hồi.
  const response = await agent.post('/auth/refresh').set(headers).send({});

  // Kiểm tra: từ chối, không cấp cookie mới hoặc thay đổi phiên.
  expect(response.status).toBe(401);
  expect(response.body).toEqual({
    success: false,
    error: {
      code: 'UNAUTHENTICATED',
      message: 'Không thể gia hạn phiên. Vui lòng đăng nhập lại.',
    },
  });
  expect(response.headers['set-cookie']).toBeUndefined();
  expect(response.headers['cache-control']).toBe('no-store');
  const sessions = await prisma.refreshToken.findMany({ where: { userId } });
  expect(sessions).toEqual([revokedSession]);
});

test('refresh revokes the token family when an old token is reused', async () => {
  // Chuẩn bị: login lấy R1 rồi refresh thành công để nhận R2.
  const agent = request.agent(app);
  const loginResponse = await agent.post('/auth/login').set(headers).send({ email, password });
  expect(loginResponse.status).toBe(200);
  const oldCookie = (loginResponse.headers['set-cookie'][0] as string).split(';')[0]!;

  const refreshResponse = await agent.post('/auth/refresh').set(headers).send({});
  expect(refreshResponse.status).toBe(200);
  const newCookie = (refreshResponse.headers['set-cookie'][0] as string).split(';')[0]!;
  expect(newCookie).not.toBe(oldCookie);
  const sessionsBeforeReuse = await prisma.refreshToken.findMany({
    where: { userId }, orderBy: { id: 'asc' },
  });
  expect(sessionsBeforeReuse).toHaveLength(2);
  expect(sessionsBeforeReuse.every(session => session.revokedAt === null)).toBe(true);

  // Gọi API: cố ý gửi lại R1 bằng request riêng, tránh agent tự gửi R2.
  const reuseResponse = await request(app).post('/auth/refresh').set(headers)
    .set('Cookie', oldCookie).send({});

  // Kiểm tra: reuse bị từ chối và cả R1/R2 bị thu hồi trong DB.
  expect(reuseResponse.status).toBe(401);
  expect(reuseResponse.body).toEqual({
    success: false,
    error: {
      code: 'UNAUTHENTICATED',
      message: 'Không thể gia hạn phiên. Vui lòng đăng nhập lại.',
    },
  });
  expect(reuseResponse.headers['set-cookie']).toBeUndefined();
  const sessionsAfterReuse = await prisma.refreshToken.findMany({
    where: { userId }, orderBy: { id: 'asc' },
  });
  expect(sessionsAfterReuse).toHaveLength(2);
  // Hai lần đọc đều sắp theo id để so đúng bản ghi trước/sau.
  expect(sessionsAfterReuse[0]).toEqual({
    ...sessionsBeforeReuse[0],
    revokedAt: expect.any(Date),
  });
  expect(sessionsAfterReuse[1]).toEqual({
    ...sessionsBeforeReuse[1],
    revokedAt: expect.any(Date),
  });
  expect(sessionsAfterReuse[0]!.revokedAt).toEqual(sessionsAfterReuse[1]!.revokedAt);

  // R2 cũng không còn refresh được; không tạo thêm token hoặc sửa lại thời điểm thu hồi.
  const newTokenResponse = await request(app).post('/auth/refresh').set(headers)
    .set('Cookie', newCookie).send({});
  expect(newTokenResponse.status).toBe(401);
  expect(newTokenResponse.body.error.code).toBe('UNAUTHENTICATED');
  expect(newTokenResponse.headers['set-cookie']).toBeUndefined();
  const sessionsAfterRejection = await prisma.refreshToken.findMany({
    where: { userId }, orderBy: { id: 'asc' },
  });
  expect(sessionsAfterRejection).toEqual(sessionsAfterReuse);
});

test('refresh token reuse does not revoke another login family of the same user', async () => {
  // Chuẩn bị: cùng User đăng nhập hai lần để tạo hai nhóm phiên độc lập.
  const agentA = request.agent(app);
  const loginA = await agentA.post('/auth/login').set(headers).send({ email, password });
  expect(loginA.status).toBe(200);
  const oldCookieA = (loginA.headers['set-cookie'][0] as string).split(';')[0]!;
  const sessionA = await prisma.refreshToken.findFirstOrThrow({ where: { userId } });

  const agentB = request.agent(app);
  const loginB = await agentB.post('/auth/login').set(headers).send({ email, password });
  expect(loginB.status).toBe(200);
  const sessionB = await prisma.refreshToken.findFirstOrThrow({
    where: { userId, familyId: { not: sessionA.familyId } },
  });

  const refreshA = await agentA.post('/auth/refresh').set(headers).send({});
  expect(refreshA.status).toBe(200);

  // Gọi API: dùng lại token cũ của nhóm A.
  const reuseA = await request(app).post('/auth/refresh').set(headers)
    .set('Cookie', oldCookieA).send({});

  // Kiểm tra: A bị từ chối, bản ghi B vẫn nguyên vẹn.
  expect(reuseA.status).toBe(401);
  expect(reuseA.body.error.code).toBe('UNAUTHENTICATED');
  const unchangedSessionB = await prisma.refreshToken.findUniqueOrThrow({
    where: { id: sessionB.id },
  });
  expect(unchangedSessionB).toEqual(sessionB);

  // Cookie của B vẫn dùng được để refresh và token mới vẫn thuộc nhóm B.
  const refreshB = await agentB.post('/auth/refresh').set(headers).send({});
  expect(refreshB.status).toBe(200);
  const sessionsB = await prisma.refreshToken.findMany({
    where: { userId, familyId: sessionB.familyId },
  });
  expect(sessionsB).toHaveLength(2);
  expect(sessionsB.every(session => session.revokedAt === null)).toBe(true);
});

test('concurrent refresh requests with the same token rotate once and revoke the family', async () => {
  // Chuẩn bị: cả hai request sẽ gửi cùng cookie R1, không chia sẻ cookie jar.
  const loginResponse = await request(app).post('/auth/login').set(headers).send({ email, password });
  expect(loginResponse.status).toBe(200);
  const r1Cookie = (loginResponse.headers['set-cookie'][0] as string).split(';')[0]!;
  const r1BeforeRequests = await prisma.refreshToken.findFirstOrThrow({ where: { userId } });

  // Gọi API đồng thời, không await từng request riêng.
  const responses = await Promise.all([
    request(app).post('/auth/refresh').set(headers).set('Cookie', r1Cookie).send({}),
    request(app).post('/auth/refresh').set(headers).set('Cookie', r1Cookie).send({}),
  ]);

  // Kiểm tra: chỉ một request thành công, request còn lại phát hiện reuse.
  expect(responses.map(response => response.status).sort()).toEqual([200, 401]);
  const successResponse = responses.find(response => response.status === 200)!;
  const rejectedResponse = responses.find(response => response.status === 401)!;
  expect(rejectedResponse.body.error.code).toBe('UNAUTHENTICATED');
  expect(rejectedResponse.headers['set-cookie']).toBeUndefined();
  const r2Cookie = (successResponse.headers['set-cookie'][0] as string).split(';')[0]!;
  expect(r2Cookie).not.toBe(r1Cookie);
  const r2Token = r2Cookie.slice('refreshToken='.length);
  const r2TokenHash = createHash('sha256').update(r2Token).digest('hex');

  const sessionsAfterRequests = await prisma.refreshToken.findMany({
    where: { userId }, orderBy: { id: 'asc' },
  });
  expect(sessionsAfterRequests).toHaveLength(2);
  const r1AfterRequests = sessionsAfterRequests.find(session => session.id === r1BeforeRequests.id)!;
  const r2AfterRequests = sessionsAfterRequests.find(session => session.tokenHash === r2TokenHash)!;
  expect(r1AfterRequests.usedAt).toBeInstanceOf(Date);
  expect(r2AfterRequests.usedAt).toBeNull();
  expect(r2AfterRequests.familyId).toBe(r1BeforeRequests.familyId);
  expect(r1AfterRequests.revokedAt).toBeInstanceOf(Date);
  expect(r2AfterRequests.revokedAt).toEqual(r1AfterRequests.revokedAt);

  // R2 vừa cấp cũng đã bị thu hồi; gửi lại phải bị từ chối và DB giữ nguyên.
  const r2RefreshResponse = await request(app).post('/auth/refresh').set(headers)
    .set('Cookie', r2Cookie).send({});
  expect(r2RefreshResponse.status).toBe(401);
  expect(r2RefreshResponse.body.error.code).toBe('UNAUTHENTICATED');
  expect(r2RefreshResponse.headers['set-cookie']).toBeUndefined();

  const sessionsAfterR2Rejection = await prisma.refreshToken.findMany({
    where: { userId }, orderBy: { id: 'asc' },
  });
  expect(sessionsAfterR2Rejection).toEqual(sessionsAfterRequests);
});

test('refresh issues a valid access JWT with the current user role and a fifteen-minute lifetime', async () => {
  // Chuẩn bị: login khi là CUSTOMER, sau đó đổi role trong DB thành ADMIN.
  const agent = request.agent(app);
  const loginResponse = await agent.post('/auth/login').set(headers).send({ email, password });
  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.data.user.role).toBe('CUSTOMER');
  await prisma.user.update({ where: { id: userId }, data: { role: 'ADMIN' } });

  // Gọi API refresh bằng cookie đã nhận khi login.
  const response = await agent.post('/auth/refresh').set(headers).send({});

  // Kiểm tra chữ ký, đúng User, role hiện hành và hạn 15 phút.
  expect(response.status).toBe(200);
  const payload = jwt.verify(response.body.data.accessToken, getJwtAccessSecret(), {
    algorithms: ['HS256'],
  });
  if (typeof payload === 'string') throw new Error('Expected JWT object payload');
  expect(payload.sub).toBe(userId);
  expect(payload.role).toBe('ADMIN');
  expect(payload.iat).toEqual(expect.any(Number));
  expect(payload.exp).toEqual(expect.any(Number));
  expect(payload.exp! - payload.iat!).toBe(900);
});

test('refresh rolls back the old token update when saving the new token fails', async () => {
  // Chuẩn bị: login nhận R1, lưu trạng thái DB trước refresh.
  const agent = request.agent(app);
  const loginResponse = await agent.post('/auth/login').set(headers).send({ email, password });
  expect(loginResponse.status).toBe(200);
  const r1BeforeRequest = await prisma.refreshToken.findFirstOrThrow({ where: { userId } });
  expect(r1BeforeRequest.usedAt).toBeNull();

  // Chỉ trong test này: buộc INSERT R2 trùng hash R1 để PostgreSQL báo lỗi unique.
  // Các thao tác UPDATE/INSERT và rollback vẫn chạy trên transaction DB thật.
  let attemptedToSaveR2 = false;
  const originalTransaction = prisma.$transaction.bind(prisma);
  const transactionSpy = vi.spyOn(prisma, '$transaction')
    .mockImplementation((callback, options) => originalTransaction(async tx => {
      const originalCreate = tx.refreshToken.create.bind(tx.refreshToken);
      const createSpy = vi.spyOn(tx.refreshToken, 'create').mockImplementation(args => {
        attemptedToSaveR2 = true;
        return originalCreate({ ...args, data: { ...args.data, tokenHash: r1BeforeRequest.tokenHash } });
      });
      try {
        return await callback(tx);
      } finally {
        createSpy.mockRestore();
      }
    }, options));

  try {
    const response = await agent.post('/auth/refresh').set(headers).send({});

    expect(attemptedToSaveR2).toBe(true);
    expect(response.status).toBe(500);
    expect(response.body.error.code).toBe('INTERNAL_ERROR');
    expect(response.headers['set-cookie']).toBeUndefined();
    const sessionsAfterFailure = await prisma.refreshToken.findMany({ where: { userId } });
    expect(sessionsAfterFailure).toEqual([r1BeforeRequest]);
  } finally {
    transactionSpy.mockRestore();
  }

  // Bỏ lỗi giả lập: R1 vẫn dùng được vì usedAt đã được rollback về null.
  const retryResponse = await agent.post('/auth/refresh').set(headers).send({});
  expect(retryResponse.status).toBe(200);
  expect(await prisma.refreshToken.count({ where: { userId } })).toBe(2);
});

test('refresh returns access data and rotates the refresh cookie and session', async () => {
  // Chuẩn bị: agent nhớ cookie từ login để gửi lại khi refresh.
  const agent = request.agent(app);
  const loginResponse = await agent.post('/auth/login').set(headers).send({ email, password });
  expect(loginResponse.status).toBe(200);

  const oldSession = await prisma.refreshToken.findFirstOrThrow({ where: { userId } });
  expect(oldSession.usedAt).toBeNull();
  expect(oldSession.revokedAt).toBeNull();
  const oldCookie = (loginResponse.headers['set-cookie'][0] as string).split(';')[0];

  // Gọi API: chỉ dùng cookie, không gửi Authorization hoặc token trong body.
  const before = Date.now();
  const response = await agent.post('/auth/refresh').set(headers).send({});
  const after = Date.now();

  // Kiểm tra response, cookie mới và thay đổi phiên trong DB.
  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    success: true,
    message: 'Gia hạn phiên thành công',
    data: { accessToken: expect.any(String), tokenType: 'Bearer', expiresIn: 900 },
  });
  expect(response.headers['cache-control']).toBe('no-store');

  const cookie = response.headers['set-cookie'][0] as string;
  const newCookie = cookie.split(';')[0]!;
  expect(newCookie).toMatch(/^refreshToken=[A-Za-z0-9_-]{43}$/);
  expect(newCookie).not.toBe(oldCookie);
  expect(cookie).toContain('HttpOnly');
  expect(cookie).toContain('SameSite=Lax');
  expect(cookie).toContain('Path=/');
  expect(cookie).not.toContain('Domain=');
  expect(cookie).not.toContain('Secure');

  const updatedOldSession = await prisma.refreshToken.findUniqueOrThrow({ where: { id: oldSession.id } });
  expect(updatedOldSession.usedAt!.getTime()).toBeGreaterThanOrEqual(before);
  expect(updatedOldSession.usedAt!.getTime()).toBeLessThanOrEqual(after);
  expect(updatedOldSession.expiresAt).toEqual(oldSession.expiresAt);
  expect(updatedOldSession.revokedAt).toBeNull();

  const sessions = await prisma.refreshToken.findMany({ where: { userId } });
  expect(sessions).toHaveLength(2);
  const newToken = newCookie.slice('refreshToken='.length);
  const expectedHash = createHash('sha256').update(newToken).digest('hex');
  const newSession = sessions.find(session => session.tokenHash === expectedHash);
  expect(newSession).toBeDefined();
  expect(newSession!.familyId).toBe(oldSession.familyId);
  expect(newSession!.usedAt).toBeNull();
  expect(newSession!.revokedAt).toBeNull();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  expect(newSession!.expiresAt.getTime()).toBe(updatedOldSession.usedAt!.getTime() + sevenDays);
});
