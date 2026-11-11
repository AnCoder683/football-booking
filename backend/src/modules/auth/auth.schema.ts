import { z } from 'zod';

export const registerBodySchema = z.strictObject({
  name: z.string()
    .trim()
    .transform(value => value.replace(/\s+/gu, ' '))
    .pipe(z.string().min(1).max(100)),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  password: z.string().refine(value => {
    // bcrypt only uses the first 72 bytes; reject longer passwords without truncating.
    return [...value].length >= 15 && Buffer.byteLength(value, 'utf8') <= 72;
  }, { message: 'Mật khẩu phải có ít nhất 15 ký tự và không vượt quá 72 byte UTF-8.' }),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
