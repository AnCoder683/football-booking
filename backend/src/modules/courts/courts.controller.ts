import type { Request, Response } from 'express';
import { listCourts } from './courts.service.js';
import type { CourtsLocals } from './courts.validation.js';

export async function listCourtsController(_req: Request, res: Response<unknown, CourtsLocals>) {
  const result = await listCourts(res.locals.courtsQuery);
  res.status(200).json({
    success: true,
    message: 'Lấy danh sách sân thành công',
    ...result,
  });
}
