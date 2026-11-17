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

export const listAdminCourtsQuerySchema = listCourtsQuerySchema.extend({
  isActive: z.enum(['true', 'false'], { error: 'isActive chỉ nhận true hoặc false.' })
    .transform(value => value === 'true')
    .optional(),
});

export type ListAdminCourtsQuery = z.infer<typeof listAdminCourtsQuerySchema>;

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

export const courtAvailabilityQuerySchema = z.object({
  date: z.string({ error: 'date bắt buộc, định dạng YYYY-MM-DD.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'date phải có định dạng YYYY-MM-DD.' })
    .refine(value => {
      const timestamp = Date.parse(`${value}T00:00:00Z`);
      return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
    }, { message: 'date phải là ngày lịch hợp lệ.' })
    .refine(value => {
      // Vietnam is UTC+07:00; do not use the server's local timezone for calendar dates.
      const now = Date.now();
      const today = new Date(now + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const lastDay = new Date(now + 7 * 60 * 60 * 1000 + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      return value >= today && value <= lastDay;
    }, { message: 'date phải từ hôm nay đến hôm nay + 7 ngày theo giờ Việt Nam.' }),
  durationMinutes: z.enum(['30', '60', '90', '120'], { error: 'durationMinutes chỉ nhận 30, 60, 90 hoặc 120.' })
    .transform(Number),
});

export type CourtAvailabilityQuery = z.infer<typeof courtAvailabilityQuerySchema>;
