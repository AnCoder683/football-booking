import type { Request, Response } from 'express';
import { listCourts } from './courts.service.js';
import type { ListCourtsQuery } from './courts.schema.js';

type CourtsLocals = { query: ListCourtsQuery };

export async function listCourtsController(_req: Request, res: Response<unknown, CourtsLocals>) {
  const result = await listCourts(res.locals.query);
  res.status(200).json({
    success: true,
    message: 'Lấy danh sách sân thành công',
    ...result,
  });
}
