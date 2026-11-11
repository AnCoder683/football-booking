import express, { type ErrorRequestHandler } from 'express';
import { courtsRouter } from './modules/courts/courts.routes.js';
import { authRouter } from './modules/auth/auth.routes.js';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.use('/courts', courtsRouter);
app.use('/auth', authRouter);

// Express 5 forwards rejected async handlers here. Keep DB/stack details
// out of responses, including when PostgreSQL is unavailable.
const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error.type === 'entity.parse.failed') {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_JSON', message: 'Nội dung JSON không hợp lệ.' },
    });
    return;
  }

  if (error.type === 'entity.too.large') {
    res.status(413).json({
      success: false,
      error: { code: 'PAYLOAD_TOO_LARGE', message: 'Nội dung yêu cầu quá lớn.' },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Không thể xử lý yêu cầu lúc này. Vui lòng thử lại.' },
  });
};
app.use(handleError);
