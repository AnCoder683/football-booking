import { randomUUID } from 'node:crypto';
import { afterAll, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

afterAll(async () => { await prisma.$disconnect(); });

test('GET /branches publicly returns branch fields in order including branches without courts', async () => {
  expect(process.env.NODE_ENV).toBe('test');
  const databases = await prisma.$queryRaw<{ name: string }[]>`SELECT current_database() AS name`;
  expect(databases[0].name).toBe('football_booking_test');
  const suffix = randomUUID();
  const branchB = { id: randomUUID(), name: `Branch B ${suffix}`, address: 'Test address B' };
  const branchA = { id: randomUUID(), name: `Branch A ${suffix}`, address: 'Test address A' };
  const branchIds: string[] = [branchB.id, branchA.id];
  await prisma.branch.createMany({ data: [branchB, branchA] });

  try {
    const response = await request(app).get('/branches');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Lấy danh sách chi nhánh thành công');
    const createdBranches = response.body.data.filter((branch: { id: string }) => branchIds.includes(branch.id));
    expect(createdBranches).toEqual([branchA, branchB]);
    expect(await prisma.court.count({ where: { branchId: { in: branchIds } } })).toBe(0);
  } finally {
    await prisma.branch.deleteMany({ where: { id: { in: branchIds } } });
  }
});
