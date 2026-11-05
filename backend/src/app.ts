import express, { type ErrorRequestHandler } from 'express';
import type { PrismaClient } from './generated/prisma/client.js';
import { createCourtsRouter } from './modules/courts/courts.routes.js';

export function createApp(database: PrismaClient) {
  const app = express();

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  app.use('/courts', createCourtsRouter(database));

  // Express 5 forwards rejected async handlers here. Keep DB/stack details
  // out of responses, including when PostgreSQL is unavailable.
  const handleError: ErrorRequestHandler = (_error, _req, res, _next) => {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Không thể xử lý yêu cầu lúc này. Vui lòng thử lại.' },
    });
  };
  app.use(handleError);
  return app;
}
