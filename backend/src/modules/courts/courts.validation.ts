import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

function integerQuery(fallback: number, maximum: number, message: string) {
  return z.string({ error: message })
    .regex(/^\d+$/, { error: message })
    .transform(Number)
    .pipe(z.number({ error: message })
      .int({ error: message })
      .min(1, { error: message })
      .max(maximum, { error: message }))
    .default(fallback);
}

// Validate the string before conversion: blank strings, arrays, fractions,
// scientific notation and partially numeric values must not be coerced.
export const listCourtsQuerySchema = z.object({
  page: integerQuery(1, Number.MAX_SAFE_INTEGER, 'page phải là số nguyên dương hợp lệ.'),
  limit: integerQuery(10, 50, 'limit phải là số nguyên từ 1 đến 50.'),
  branchId: z.string({ error: 'branchId phải là UUID hợp lệ.' })
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      { error: 'branchId phải là UUID hợp lệ.' })
    .optional(),
  playersPerTeam: z.enum(['5', '7', '11'], { error: 'playersPerTeam chỉ nhận 5, 7 hoặc 11.' })
    .transform(Number)
    .optional(),
});

// Infer the parsed output type from the schema; do not maintain a second shape.
export type ListCourtsQuery = z.infer<typeof listCourtsQuerySchema>;
export type CourtsLocals = { courtsQuery: ListCourtsQuery };

export function validateListCourts(req: Request, res: Response<unknown, CourtsLocals>, next: NextFunction) {
  const result = listCourtsQuerySchema.safeParse(req.query);
  if (!result.success) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Dữ liệu không hợp lệ.',
        details: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
    return;
  }

  res.locals.courtsQuery = result.data;
  next();
}
