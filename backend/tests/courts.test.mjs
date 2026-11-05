import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.ts';
import { createApp } from '../src/app.ts';
import { getDatabaseUrl } from '../src/config/database-config.ts';

const databaseName = process.env.TEST_DATABASE_NAME;
if (!databaseName || !/^football_booking_api_test_\d+_\d+$/.test(databaseName)) {
  throw new Error('Use scripts/check-courts-api.sh to create a separate API test database.');
}
const url = new URL(getDatabaseUrl());
url.pathname = `/${databaseName}`;
const database = new PrismaClient({
  adapter: new PrismaPg({ connectionString: url.toString(), connectionTimeoutMillis: 5000 }),
});
const branchA = '30000000-0000-4000-8000-000000000001';
const branchB = '30000000-0000-4000-8000-000000000002';
const courtId = (number) => `40000000-0000-4000-8000-${String(number).padStart(12, '0')}`;
let server;
let baseUrl;

async function listen(app) {
  const instance = await new Promise((resolve, reject) => {
    const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
    listening.on('error', reject);
  });
  return { server: instance, url: `http://127.0.0.1:${instance.address().port}` };
}

function close(instance) {
  return new Promise((resolve, reject) => instance.close((error) => error ? reject(error) : resolve()));
}

async function get(query = '') {
  const response = await fetch(`${baseUrl}/courts${query}`);
  return { status: response.status, body: await response.json() };
}

before(async () => {
  assert.equal((await database.$queryRaw`SELECT current_database() AS name`)[0].name, databaseName);
  ({ server, url: baseUrl } = await listen(createApp(database)));
});
after(async () => {
  if (server) await close(server);
  await database.$disconnect();
});

test('public list: active courts only, exact fields, defaults and stable ordering', async () => {
  const { status, body } = await get();
  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.message, 'Lấy danh sách sân thành công');
  assert.deepEqual(body.meta, { page: 1, limit: 10, total: 4, totalPages: 1 });
  assert.deepEqual(body.data.map((court) => court.id), [courtId(1), courtId(4), courtId(2), courtId(3)]);
  assert.ok(body.data.every((court) => court.isActive));
  assert.deepEqual(Object.keys(body.data[0]).sort(), ['branch', 'id', 'isActive', 'name', 'playersPerTeam', 'pricePerSlot']);
  assert.deepEqual(body.data[0].branch, { id: branchA, name: 'API Test A', address: 'Test address A' });
  assert.equal(body.data[0].pricePerSlot, 150000);
});

test('filter by branch and team size with AND, total counts after filtering', async () => {
  const result = await get(`?branchId=${branchA}&playersPerTeam=5`);
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.data.map((court) => court.id), [courtId(1)]);
  assert.equal(result.body.meta.total, 1);
  const byType = await get('?playersPerTeam=5');
  assert.equal(byType.body.meta.total, 2);
  const byBranch = await get(`?branchId=${branchB}`);
  assert.deepEqual(byBranch.body.data.map((court) => court.id), [courtId(4)]);
});

test('pagination honors order, page size and filtered totals', async () => {
  const { status, body } = await get('?page=2&limit=2');
  assert.equal(status, 200);
  assert.deepEqual(body.data.map((court) => court.id), [courtId(2), courtId(3)]);
  assert.deepEqual(body.meta, { page: 2, limit: 2, total: 4, totalPages: 2 });
});

test('nonexistent branch and nonmatching combined filters return 200 with empty data', async () => {
  for (const query of [`?branchId=30000000-0000-4000-8000-000000000099`, `?branchId=${branchB}&playersPerTeam=7`]) {
    const { status, body } = await get(query);
    assert.equal(status, 200);
    assert.deepEqual(body.data, []);
    assert.equal(body.meta.total, 0);
    assert.equal(body.meta.totalPages, 0);
  }
});

test('out-of-range pages, including large safe integers, return empty data', async () => {
  for (const page of ['99', '9007199254740991']) {
    const { status, body } = await get(`?page=${page}&limit=50`);
    assert.equal(status, 200);
    assert.deepEqual(body.data, []);
    assert.equal(body.meta.total, 4);
  }
});

test('invalid query values return 400 with field details', async (t) => {
  const invalid = [
    ['page', '0'], ['page', '-1'], ['page', '1.5'], ['page', '2junk'],
    ['page', '1e2'], ['page', '9007199254740992'], ['page', ''],
    ['limit', '0'], ['limit', '51'], ['limit', '2.5'],
    ['playersPerTeam', '6'], ['playersPerTeam', '5x'], ['playersPerTeam', '05'],
    ['branchId', 'not-a-uuid'], ['branchId', ''],
  ];
  for (const [field, value] of invalid) {
    await t.test(`${field}=${value}`, async () => {
      const { status, body } = await get(`?${field}=${encodeURIComponent(value)}`);
      assert.equal(status, 400);
      assert.equal(body.success, false);
      assert.equal(body.error.code, 'VALIDATION_ERROR');
      assert.ok(body.error.details.some((detail) => detail.field === field));
    });
  }
  for (const field of ['page', 'limit', 'playersPerTeam', 'branchId']) {
    await t.test(`reject repeated ${field}`, async () => {
      const { status, body } = await get(`?${field}=5&${field}=7`);
      assert.equal(status, 400);
      assert.ok(body.error.details.some((detail) => detail.field === field));
    });
  }
});

test('caller cannot opt in to inactive courts', async () => {
  const { status, body } = await get('?isActive=false');
  assert.equal(status, 200);
  assert.equal(body.meta.total, 4);
  assert.ok(body.data.every((court) => court.isActive));
});

test('health endpoint stays available', async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('unexpected database error returns safe JSON without SQL/connection details', async () => {
  const broken = await listen(createApp({ court: { count: async () => { throw new Error('secret-connection-example'); } } }));
  try {
    const response = await fetch(`${broken.url}/courts`);
    assert.equal(response.status, 500);
    const body = await response.json();
    assert.deepEqual(body, {
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Không thể xử lý yêu cầu lúc này. Vui lòng thử lại.' },
    });
  } finally {
    await close(broken.server);
  }
});
