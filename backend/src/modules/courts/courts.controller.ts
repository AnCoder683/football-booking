import type { Request, Response } from 'express';
import { createCourt, getCourt, listCourts, updateCourt } from './courts.service.js';
import type { CourtParams, CreateCourtBody, ListCourtsQuery, UpdateCourtBody } from './courts.schema.js';

type UpdateCourtLocals = { params: CourtParams; body: UpdateCourtBody };

export async function updateCourtController(_req: Request, res: Response<unknown, UpdateCourtLocals>) {
  const result = await updateCourt(res.locals.params.courtId, res.locals.body);
  if (result.status === 'COURT_NOT_FOUND') {
    res.status(404).json({
      success: false,
      error: { code: 'COURT_NOT_FOUND', message: 'Không tìm thấy sân.' },
    });
    return;
  }
  if (result.status === 'COURT_NAME_CONFLICT') {
    res.status(409).json({
      success: false,
      error: {
        code: 'COURT_NAME_CONFLICT',
        message: 'Tên sân đã tồn tại trong chi nhánh này. Vui lòng chọn tên khác.',
      },
    });
    return;
  }

  res.status(200).json({ success: true, message: 'Cập nhật sân thành công', data: result.data });
}

type CreateCourtLocals = { body: CreateCourtBody };

export async function createCourtController(_req: Request, res: Response<unknown, CreateCourtLocals>) {
  const result = await createCourt(res.locals.body);
  if (result.status === 'BRANCH_NOT_FOUND') {
    res.status(404).json({
      success: false,
      error: { code: 'BRANCH_NOT_FOUND', message: 'Không tìm thấy chi nhánh.' },
    });
    return;
  }
  if (result.status === 'COURT_NAME_CONFLICT') {
    res.status(409).json({
      success: false,
      error: {
        code: 'COURT_NAME_CONFLICT',
        message: 'Tên sân đã tồn tại trong chi nhánh này. Vui lòng chọn tên khác.',
      },
    });
    return;
  }

  res.status(201).json({ success: true, message: 'Tạo sân thành công', data: result.data });
}

type CourtLocals = { params: CourtParams };

export async function getCourtController(_req: Request, res: Response<unknown, CourtLocals>) {
  const court = await getCourt(res.locals.params.courtId);
  if (court === null) {
    res.status(404).json({
      success: false,
      error: { code: 'COURT_NOT_FOUND', message: 'Không tìm thấy sân.' },
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Lấy thông tin sân thành công',
    data: court,
  });
}

type CourtsLocals = { query: ListCourtsQuery };

export async function listCourtsController(_req: Request, res: Response<unknown, CourtsLocals>) {
  const result = await listCourts(res.locals.query);
  res.status(200).json({
    success: true,
    message: 'Lấy danh sách sân thành công',
    ...result,
  });
}
