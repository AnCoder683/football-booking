import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { validateBody } from '../../middlewares/validate-body.js';
import { registerController } from './auth.controller.js';
import { registerBodySchema } from './auth.schema.js';

export const authRouter = Router();

// shortcut: counters reset on restart; use a shared store if running multiple app instances.
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Bạn đã gửi quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau.',
    },
  },
});

authRouter.post('/register', registerLimiter, validateBody(registerBodySchema), registerController);
