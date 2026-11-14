import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { validateBody } from '../../middlewares/validate-body.js';
import { csrfProtection } from '../../middlewares/csrf-protection.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { loginController, meController, registerController } from './auth.controller.js';
import { loginBodySchema, registerBodySchema } from './auth.schema.js';

export const authRouter = Router();

authRouter.post(['/login', '/refresh', '/logout'], csrfProtection);

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

// shortcut: counters reset on restart; use a shared store if running multiple app instances.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Bạn đã gửi quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau.',
    },
  },
});

authRouter.post('/register', registerLimiter, validateBody(registerBodySchema), registerController);
authRouter.post('/login', loginLimiter, validateBody(loginBodySchema), loginController);
authRouter.get('/me', authenticate, meController);
