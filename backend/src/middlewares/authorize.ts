import type { NextFunction, Request, Response } from 'express';

export function authorize(requiredRole: 'CUSTOMER' | 'ADMIN') {
  return (_req: Request, res: Response<unknown, { role?: string }>, next: NextFunction) => {
    if (res.locals.role !== requiredRole) {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Bạn không có quyền thực hiện thao tác này.' },
      });
      return;
    }

    next();
  };
}
