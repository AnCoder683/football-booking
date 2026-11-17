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

export const courtParamsSchema = z.object({
  courtId: z.string({ error: 'courtId phải là UUID hợp lệ.' })
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      { error: 'courtId phải là UUID hợp lệ.' }),
});

export type CourtParams = z.infer<typeof courtParamsSchema>;

export const createCourtBodySchema = z.strictObject({
  branchId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    { error: 'branchId phải là UUID hợp lệ.' }),
  name: z.string().trim().transform(value => value.replace(/\s+/gu, ' '))
    .pipe(z.string().min(1).max(100)),
  playersPerTeam: z.union([z.literal(5), z.literal(7), z.literal(11)]),
  pricePerSlot: z.number().int().min(1).max(536870911),
  isActive: z.boolean().default(true),
});

export type CreateCourtBody = z.infer<typeof createCourtBodySchema>;

export const updateCourtBodySchema = z.strictObject({
  name: createCourtBodySchema.shape.name.optional(),
  playersPerTeam: createCourtBodySchema.shape.playersPerTeam.optional(),
  pricePerSlot: createCourtBodySchema.shape.pricePerSlot.optional(),
  isActive: z.boolean().optional(),
}).refine(body => Object.keys(body).length > 0, { message: 'Cần gửi ít nhất một trường để cập nhật.' });

export type UpdateCourtBody = z.infer<typeof updateCourtBodySchema>;
