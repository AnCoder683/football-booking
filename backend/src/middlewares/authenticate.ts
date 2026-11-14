import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtAccessSecret } from '../config/auth-config.js';

export function authenticate(req: Request, res: Response<unknown, { userId: string }>, next: NextFunction) {
  const secret = getJwtAccessSecret();
  const authorization = req.get('Authorization') ?? '';
  const [scheme, token, extra] = authorization.split(' ');

  try {
    if (scheme.toLowerCase() !== 'bearer' || !token || extra !== undefined) {
      throw new jwt.JsonWebTokenError('Invalid Bearer token');
    }

    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    if (typeof payload === 'string' || typeof payload.sub !== 'string' ||
        !payload.sub || typeof payload.exp !== 'number') {
      throw new jwt.JsonWebTokenError('Invalid access token payload');
    }

    res.locals.userId = payload.sub;
  } catch (error) {
    if (!(error instanceof jwt.JsonWebTokenError)) throw error;

    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHENTICATED', message: 'Vui lòng đăng nhập để tiếp tục.' },
    });
    return;
  }

  next();
}
