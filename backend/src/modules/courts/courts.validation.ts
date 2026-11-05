import type { NextFunction, Request, Response } from 'express';

export type ListCourtsQuery = {
  page: number;
  limit: number;
  branchId?: string;
  playersPerTeam?: number;
};

export type CourtsLocals = { courtsQuery: ListCourtsQuery };
type FieldError = { field: string; message: string };

function positiveInteger(value: unknown, fallback: number): number | undefined {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return undefined;
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : undefined;
}

export function validateListCourts(req: Request, res: Response<unknown, CourtsLocals>, next: NextFunction) {
  const errors: FieldError[] = [];
  const page = positiveInteger(req.query.page, 1);
  const limit = positiveInteger(req.query.limit, 10);
  const branchId = req.query.branchId;
  const teamSize = req.query.playersPerTeam;

  if (page === undefined) errors.push({ field: 'page', message: 'page phải là số nguyên dương hợp lệ.' });
  if (limit === undefined || limit > 50) {
    errors.push({ field: 'limit', message: 'limit phải là số nguyên từ 1 đến 50.' });
  }
  if (branchId !== undefined && (typeof branchId !== 'string'
    || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(branchId))) {
    errors.push({ field: 'branchId', message: 'branchId phải là UUID hợp lệ.' });
  }
  if (teamSize !== undefined && (typeof teamSize !== 'string' || !['5', '7', '11'].includes(teamSize))) {
    errors.push({ field: 'playersPerTeam', message: 'playersPerTeam chỉ nhận 5, 7 hoặc 11.' });
  }

  if (errors.length > 0 || page === undefined || limit === undefined) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Dữ liệu không hợp lệ.', details: errors },
    });
    return;
  }

  // Pass parsed values onward; service never receives raw HTTP query.
  res.locals.courtsQuery = {
    page,
    limit,
    ...(typeof branchId === 'string' ? { branchId } : {}),
    ...(typeof teamSize === 'string' ? { playersPerTeam: Number(teamSize) } : {}),
  };
  next();
}
