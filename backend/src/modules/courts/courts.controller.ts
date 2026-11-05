import type { Request, Response } from 'express';
import type { createCourtsService } from './courts.service.js';
import type { CourtsLocals } from './courts.validation.js';

export function createCourtsController(service: ReturnType<typeof createCourtsService>) {
  return {
    async listCourts(_req: Request, res: Response<unknown, CourtsLocals>) {
      const result = await service.listCourts(res.locals.courtsQuery);
      res.status(200).json({
        success: true,
        message: 'Lấy danh sách sân thành công',
        ...result,
      });
    },
  };
}
