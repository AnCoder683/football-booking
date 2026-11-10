import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

export function validateQuery<T>(schema: ZodType<T>) {
  return (req: Request, res: Response<unknown, { query: T }>, next: NextFunction) => {
    const result = schema.safeParse(req.query);
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

    res.locals.query = result.data;
    next();
  };
}
