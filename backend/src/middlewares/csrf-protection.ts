import type { NextFunction, Request, Response } from 'express';
import { getAppOrigin } from '../config/auth-config.js';

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  const appOrigin = getAppOrigin();
  let origin = req.get('Origin');
  if (origin === undefined) {
    const referer = req.get('Referer');
    if (referer) {
      try {
        origin = new URL(referer).origin;
      } catch {
        origin = undefined;
      }
    }
  }

  if (req.get('X-CSRF-Protection') !== '1' || origin !== appOrigin) {
    res.status(403).json({
      success: false,
      error: {
        code: 'CSRF_VALIDATION_FAILED',
        message: 'Nguồn yêu cầu không hợp lệ.',
      },
    });
    return;
  }

  next();
}
