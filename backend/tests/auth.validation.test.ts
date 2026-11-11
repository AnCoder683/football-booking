import { expect, test } from 'vitest';
import { loginBodySchema, registerBodySchema } from '../src/modules/auth/auth.schema.js';
const validBody = {
  name: 'Nguyễn An',
  email: 'an@example.com',
  password: 'a long password',
};
test('registration normalizes name and email while preserving the password', () => {
  const password = '  Mật khẩu giữ nguyên 😀  ';
  expect(registerBodySchema.parse({
    name: '  Nguyễn\t An  ',
    email: '  AN+tag@EXAMPLE.COM  ',
    password,
  })).toEqual({ name: 'Nguyễn An', email: 'an+tag@example.com', password });
});
test.each([
  { name: '' }, { name: '   ' }, { name: 'a'.repeat(101) },
  { email: 'invalid-email' }, { email: `${'a'.repeat(243)}@example.com` },
  { password: 'a'.repeat(14) },
])('registration rejects invalid field values: %j', (fields) => {
  expect(registerBodySchema.safeParse({ ...validBody, ...fields }).success).toBe(false);
});
test.each([15, 72])('registration accepts an ASCII password of length %i', (length) => {
  const password = 'a'.repeat(length);
  expect(registerBodySchema.parse({ ...validBody, password }).password).toBe(password);
});
test('registration counts Unicode characters separately from UTF-8 bytes', () => {
  // 14 emoji are 14 code points; 18 emoji occupy exactly 72 UTF-8 bytes.
  expect(registerBodySchema.safeParse({ ...validBody, password: '😀'.repeat(14) }).success).toBe(false);
  const password = '😀'.repeat(18);
  expect(registerBodySchema.parse({ ...validBody, password }).password).toBe(password);
});
test('registration reports a password error when the UTF-8 byte limit is exceeded', () => {
  const result = registerBodySchema.safeParse({ ...validBody, password: 'a'.repeat(73) });
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.issues).toMatchObject([{
        path: ['password'],
        message: 'Mật khẩu phải có ít nhất 15 ký tự và không vượt quá 72 byte UTF-8.',
      }]);
  }
});
test.each(['name', 'email', 'password'] as const)('registration requires a string %s', (field) => {
  for (const value of [undefined, null, 123, [], {}]) {
    expect(registerBodySchema.safeParse({ ...validBody, [field]: value }).success).toBe(false);
  }
});
test.each([
  { role: 'ADMIN' }, { isBookingBlocked: false }, { passwordHash: 'hash' }, { extra: 'value' },
])('registration rejects extra fields: %j', (fields) => {
  expect(registerBodySchema.safeParse({ ...validBody, ...fields }).success).toBe(false);
});

test('login normalizes email while preserving the password', () => {
  expect(loginBodySchema.parse({ email: '  AN+tag@EXAMPLE.COM  ', password: ' abc ' }))
    .toEqual({ email: 'an+tag@example.com', password: ' abc ' });
});

test.each(['a', ' ', 'a'.repeat(72), '😀'.repeat(18)])(
  'login accepts a nonempty password within the byte limit: %s', (password) => {
    expect(loginBodySchema.parse({ email: validBody.email, password }).password).toBe(password);
  },
);

test.each(['', 'a'.repeat(73), '😀'.repeat(18) + 'a'])(
  'login rejects an empty or oversized password: %s', (password) => {
    expect(loginBodySchema.safeParse({ email: validBody.email, password }).success).toBe(false);
  },
);

test.each(['email', 'password'] as const)('login requires a string %s', (field) => {
  for (const value of [undefined, null, 123, [], {}]) {
    expect(loginBodySchema.safeParse({ email: validBody.email, password: 'abc', [field]: value }).success).toBe(false);
  }
});

test.each(['invalid-email', `${'a'.repeat(243)}@example.com`])('login rejects an invalid email: %s', (email) => {
  expect(loginBodySchema.safeParse({ email, password: 'abc' }).success).toBe(false);
});

test('login rejects extra fields including role', () => {
  expect(loginBodySchema.safeParse({ email: validBody.email, password: 'abc', role: 'ADMIN' }).success).toBe(false);
});
