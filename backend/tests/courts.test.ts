import { afterAll, test, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

afterAll(async () => {
  await prisma.$disconnect();
});

test.each([
  { query: { limit: '51' }, field: 'limit', message: 'limit phải là số nguyên từ 1 đến 50.' },
  { query: { branchId: 'invalid-uuid' }, field: 'branchId', message: 'branchId phải là UUID hợp lệ.' },
  { query: { playersPerTeam: '6' }, field: 'playersPerTeam', message: 'playersPerTeam chỉ nhận 5, 7 hoặc 11.' },
])('GET /courts rejects invalid $field', async ({ query, field, message }) => {
  const response = await request(app).get('/courts').query(query);

  expect(response.status).toBe(400);
  expect(response.body).toMatchObject({
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Dữ liệu không hợp lệ.',
      details: [{ field, message }],
    },
  });
});

test('GET /courts returns an empty list when no courts match the filters', async () => {
  expect(process.env.NODE_ENV).toBe('test');
  const databases = await prisma.$queryRaw<{ name: string }[]>`
    SELECT current_database() AS name
  `;
  expect(databases[0].name).toBe('football_booking_test');

  const branch = await prisma.branch.create({
    data: {
      name: 'No matching courts branch',
      address: 'Test address',
      courts: {
        create: { name: 'Court A5', playersPerTeam: 5, pricePerSlot: 150000, isActive: true },
      },
    },
  });

  try {
    const response = await request(app).get('/courts').query({
      branchId: branch.id,
      playersPerTeam: 7,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });
  } finally {
    await prisma.$transaction([
      prisma.court.deleteMany({ where: { branchId: branch.id } }),
      prisma.branch.delete({ where: { id: branch.id } }),
    ]);
  }
});

test('GET /courts sorts the full matching list by name before pagination', async () => {
  expect(process.env.NODE_ENV).toBe('test');
  const databases = await prisma.$queryRaw<{ name: string }[]>`
    SELECT current_database() AS name
  `;
  expect(databases[0].name).toBe('football_booking_test');

  const branch = await prisma.branch.create({
    data: {
      name: 'Sorted courts branch',
      address: 'Test address',
      courts: {
        create: [
          { name: 'Court D', playersPerTeam: 5, pricePerSlot: 150000, isActive: true },
          { name: 'Court B', playersPerTeam: 5, pricePerSlot: 150000, isActive: true },
          { name: 'Court A', playersPerTeam: 5, pricePerSlot: 150000, isActive: true },
          { name: 'Court C', playersPerTeam: 5, pricePerSlot: 150000, isActive: true },
        ],
      },
    },
  });

  try {
    for (const [index, names] of [['Court A', 'Court B'], ['Court C', 'Court D']].entries()) {
      const response = await request(app).get('/courts').query({
        branchId: branch.id,
        page: index + 1,
        limit: 2,
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: names.map(name => ({ name, branch: { id: branch.id } })),
        meta: { page: index + 1, limit: 2, total: 4, totalPages: 2 },
      });
    }
  } finally {
    await prisma.$transaction([
      prisma.court.deleteMany({ where: { branchId: branch.id } }),
      prisma.branch.delete({ where: { id: branch.id } }),
    ]);
  }
});

test('GET /courts rejects page zero', async () => {
  // Act
  const response = await request(app).get('/courts').query({ page: 0 });

  // Assert
  expect(response.status).toBe(400);
  expect(response.body).toMatchObject({
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Dữ liệu không hợp lệ.',
      details: [{ field: 'page', message: 'page phải là số nguyên dương hợp lệ.' }],
    },
  });
});

test('GET /courts returns an empty list for a page beyond the last page', async () => {
  // Arrange
  expect(process.env.NODE_ENV).toBe('test');
  const databases = await prisma.$queryRaw<{ name: string }[]>`
    SELECT current_database() AS name
  `;
  expect(databases[0].name).toBe('football_booking_test');

  const branch = await prisma.branch.create({
    data: {
      name: 'Out-of-range page branch',
      address: 'Test address',
      courts: {
        create: [
          { name: 'Court A', playersPerTeam: 5, pricePerSlot: 150000, isActive: true },
          { name: 'Court B', playersPerTeam: 5, pricePerSlot: 150000, isActive: true },
          { name: 'Court C', playersPerTeam: 5, pricePerSlot: 150000, isActive: true },
        ],
      },
    },
  });

  try {
    // Act
    const response = await request(app).get('/courts').query({
      branchId: branch.id,
      page: 4,
      limit: 1,
    });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: [],
      meta: { page: 4, limit: 1, total: 3, totalPages: 3 },
    });
  } finally {
    await prisma.$transaction([
      prisma.court.deleteMany({ where: { branchId: branch.id } }),
      prisma.branch.delete({ where: { id: branch.id } }),
    ]);
  }
});

test('GET /courts returns the requested page and pagination metadata', async () => {
  // Arrange
  expect(process.env.NODE_ENV).toBe('test');
  const databases = await prisma.$queryRaw<{ name: string }[]>`
    SELECT current_database() AS name
  `;
  expect(databases[0].name).toBe('football_booking_test');

  const branch = await prisma.branch.create({
    data: {
      name: 'Pagination branch',
      address: 'Test address',
      courts: {
        create: [
          { name: 'Court C', playersPerTeam: 5, pricePerSlot: 150000, isActive: true },
          { name: 'Court A', playersPerTeam: 5, pricePerSlot: 150000, isActive: true },
          { name: 'Court B', playersPerTeam: 5, pricePerSlot: 150000, isActive: true },
        ],
      },
    },
  });

  try {
    // Act
    const response = await request(app).get('/courts').query({
      branchId: branch.id,
      page: 2,
      limit: 1,
    });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: [{ name: 'Court B', branch: { id: branch.id } }],
      meta: { page: 2, limit: 1, total: 3, totalPages: 3 },
    });
  } finally {
    await prisma.$transaction([
      prisma.court.deleteMany({ where: { branchId: branch.id } }),
      prisma.branch.delete({ where: { id: branch.id } }),
    ]);
  }
});

test('GET /courts filters by playersPerTeam and branchId together', async () => {
  // Arrange
  expect(process.env.NODE_ENV).toBe('test');
  const databases = await prisma.$queryRaw<{ name: string }[]>`
    SELECT current_database() AS name
  `;
  expect(databases[0].name).toBe('football_booking_test');

  const branches = await prisma.$transaction([
    prisma.branch.create({
      data: {
        name: 'Branch A',
        address: 'Address A',
        courts: {
          create: [
            { name: 'Court A5', playersPerTeam: 5, pricePerSlot: 150000, isActive: true },
            { name: 'Court A7', playersPerTeam: 7, pricePerSlot: 200000, isActive: true },
            { name: 'Inactive A7', playersPerTeam: 7, pricePerSlot: 200000, isActive: false },
          ],
        },
      },
    }),
    prisma.branch.create({
      data: {
        name: 'Branch B',
        address: 'Address B',
        courts: {
          create: { name: 'Court B7', playersPerTeam: 7, pricePerSlot: 200000, isActive: true },
        },
      },
    }),
  ]);
  const branchA = branches[0];
  const branchB = branches[1];

  try {
    // Act
    const response = await request(app).get('/courts').query({
      branchId: branchA.id,
      playersPerTeam: 7,
    });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: [{
        name: 'Court A7',
        playersPerTeam: 7,
        isActive: true,
        branch: { id: branchA.id },
      }],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
  } finally {
    await prisma.$transaction([
      prisma.court.deleteMany({ where: { branchId: { in: [branchA.id, branchB.id] } } }),
      prisma.branch.deleteMany({ where: { id: { in: [branchA.id, branchB.id] } } }),
    ]);
  }
});

test('GET /courts excludes active courts from other branches', async () => {
  // Arrange
  expect(process.env.NODE_ENV).toBe('test');
  const databases = await prisma.$queryRaw<{ name: string }[]>`
    SELECT current_database() AS name
  `;
  expect(databases[0].name).toBe('football_booking_test');

  const [branchA, branchB] = await prisma.$transaction([
    prisma.branch.create({
      data: {
        name: 'Branch A',
        address: 'Address A',
        courts: {
          create: { name: 'Court A', playersPerTeam: 5, pricePerSlot: 150000, isActive: true },
        },
      },
    }),
    prisma.branch.create({
      data: {
        name: 'Branch B',
        address: 'Address B',
        courts: {
          create: { name: 'Court B', playersPerTeam: 5, pricePerSlot: 150000, isActive: true },
        },
      },
    }),
  ]);

  try {
    // Act
    const response = await request(app).get('/courts').query({ branchId: branchA.id });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: [{ name: 'Court A', isActive: true, branch: { id: branchA.id } }],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
  } finally {
    await prisma.$transaction([
      prisma.court.deleteMany({ where: { branchId: { in: [branchA.id, branchB.id] } } }),
      prisma.branch.deleteMany({ where: { id: { in: [branchA.id, branchB.id] } } }),
    ]);
  }
});

test('GET /courts returns only active courts in the selected branch', async () => {
  // Arrange
  expect(process.env.NODE_ENV).toBe('test');
  const databases = await prisma.$queryRaw<{ name: string }[]>`
    SELECT current_database() AS name
  `;
  expect(databases[0].name).toBe('football_booking_test');

  const branch = await prisma.branch.create({
    data: {
      name: 'Test branch',
      address: 'Test address',
      courts: {
        create: [
          { name: 'Active court', playersPerTeam: 5, pricePerSlot: 150000, isActive: true },
          { name: 'Inactive court', playersPerTeam: 5, pricePerSlot: 150000, isActive: false },
        ],
      },
    },
  });

  try {
    // Act
    const response = await request(app).get('/courts').query({ branchId: branch.id });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: [{
        name: 'Active court',
        playersPerTeam: 5,
        pricePerSlot: 150000,
        isActive: true,
        branch: { id: branch.id, name: 'Test branch', address: 'Test address' },
      }],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
  } finally {
    await prisma.$transaction([
      prisma.court.deleteMany({ where: { branchId: branch.id } }),
      prisma.branch.delete({ where: { id: branch.id } }),
    ]);
  }
});
