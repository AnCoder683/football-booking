import { expect, test } from 'vitest';
import { listCourtsQuerySchema } from '../src/modules/courts/courts.schema.js';

test('court query uses default pagination when page and limit are missing', () => {
  expect(listCourtsQuerySchema.parse({})).toEqual({ page: 1, limit: 10 });
});

test('court query accepts pagination boundaries and converts strings to numbers', () => {
  expect(listCourtsQuerySchema.parse({ page: '1', limit: '1' }))
    .toEqual({ page: 1, limit: 1 });
  expect(listCourtsQuerySchema.parse({ page: '9007199254740991', limit: '50' }))
    .toEqual({ page: Number.MAX_SAFE_INTEGER, limit: 50 });
  expect(listCourtsQuerySchema.parse({ page: '002', limit: '010' }))
    .toEqual({ page: 2, limit: 10 });
});

test.each([
  '', ' ', '0', '-1', '1.5', '1e2', '2abc', '9007199254740992',
  '9'.repeat(400), ['1', '2'], { value: '1' }, null, 1,
])('court query rejects invalid page: %j', (page) => {
  const result = listCourtsQuerySchema.safeParse({ page });
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.issues[0].path).toEqual(['page']);
    expect(result.error.issues[0].message).toBe('page phải là số nguyên dương hợp lệ.');
  }
});

test.each([
  '', ' ', '0', '-1', '1.5', '1e1', '2abc', '51', '9007199254740992',
  '9'.repeat(400), ['1', '2'], { value: '1' }, null, 1,
])('court query rejects invalid limit: %j', (limit) => {
  const result = listCourtsQuerySchema.safeParse({ limit });
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.issues[0].path).toEqual(['limit']);
    expect(result.error.issues[0].message).toBe('limit phải là số nguyên từ 1 đến 50.');
  }
});
