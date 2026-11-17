import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, res: Response<unknown, { body: T }>, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dữ liệu không hợp lệ.',
          details: result.error.issues.flatMap((issue) => {
            if (issue.code === 'unrecognized_keys') {
              return issue.keys.map(field => ({ field, message: 'Trường không được phép.' }));
            }
            return [{ field: issue.path.join('.'), message: issue.message }];
          }),
        },
      });
      return;
    }

    res.locals.body = result.data;
    next();
  };
}
