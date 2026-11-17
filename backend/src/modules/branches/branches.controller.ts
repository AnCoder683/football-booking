import type { Request, Response } from 'express';
import { listBranches } from './branches.service.js';

export async function listBranchesController(_req: Request, res: Response) {
  const data = await listBranches();
  res.status(200).json({
    success: true,
    message: 'Lấy danh sách chi nhánh thành công',
    data,
  });
}
