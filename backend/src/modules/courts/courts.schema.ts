import { z } from 'zod';

const pageMessage = 'page phải là số nguyên dương hợp lệ.';
const limitMessage = 'limit phải là số nguyên từ 1 đến 50.';

// Check digits before Number() so blank strings, fractions and scientific notation are rejected.
const pageSchema = z.string({ error: pageMessage })
  .regex(/^\d+$/, { error: pageMessage })
  .transform(Number)
  .refine(value => Number.isSafeInteger(value) && value >= 1, { error: pageMessage })
  .default(1);

const limitSchema = z.string({ error: limitMessage })
  .regex(/^\d+$/, { error: limitMessage })
  .transform(Number)
  .refine(value => Number.isSafeInteger(value) && value >= 1 && value <= 50, { error: limitMessage })
  .default(10);

export const listCourtsQuerySchema = z.object({
  page: pageSchema,
  limit: limitSchema,
  branchId: z.string({ error: 'branchId phải là UUID hợp lệ.' })
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      { error: 'branchId phải là UUID hợp lệ.' })
    .optional(),
  playersPerTeam: z.enum(['5', '7', '11'], { error: 'playersPerTeam chỉ nhận 5, 7 hoặc 11.' })
    .transform(Number)
    .optional(),
});

export type ListCourtsQuery = z.infer<typeof listCourtsQuerySchema>;
