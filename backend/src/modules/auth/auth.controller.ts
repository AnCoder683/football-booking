import type { Request, Response } from 'express';
import type { LoginBody, RegisterBody } from './auth.schema.js';
import { getMe, login, register } from './auth.service.js';

type MeLocals = { userId: string };

export async function meController(_req: Request, res: Response<unknown, MeLocals>) {
  res.set('Cache-Control', 'no-store');
  const user = await getMe(res.locals.userId);

  // A valid access token can outlive the user account deleted from the database.
  if (user === null) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Vui lòng đăng nhập để tiếp tục.',
      },
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Lấy thông tin tài khoản thành công',
    data: user,
  });
}

type RegisterLocals = { body: RegisterBody };

export async function registerController(_req: Request, res: Response<unknown, RegisterLocals>) {
  const user = await register(res.locals.body);

  if (user === null) {
    res.status(409).json({
      success: false,
      error: {
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Email đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.',
      },
    });
    return;
  }

  res.status(201).json({
    success: true,
    message: 'Đăng ký thành công. Vui lòng đăng nhập.',
    data: user,
  });
}

type LoginLocals = { body: LoginBody };

export async function loginController(_req: Request, res: Response<unknown, LoginLocals>) {
  res.set('Cache-Control', 'no-store');
  const result = await login(res.locals.body);

  if (result === null) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Email hoặc mật khẩu không đúng.',
      },
    });
    return;
  }

  const { refreshToken, refreshTokenExpiresAt, ...data } = result;
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: refreshTokenExpiresAt,
  });

  res.status(200).json({
    success: true,
    message: 'Đăng nhập thành công',
    data,
  });
}
