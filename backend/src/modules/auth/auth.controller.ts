import type { Request, Response } from 'express';
import type { RegisterBody } from './auth.schema.js';
import { register } from './auth.service.js';

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
