import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

export function validateParams<T>(schema: ZodType<T>) {
  return (req: Request, res: Response<unknown, { params: T }>, next: NextFunction) => {
    const result = schema.safeParse(req.params);
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

    res.locals.params = result.data;
    next();
  };
}
