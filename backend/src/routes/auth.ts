import { Router } from 'express';
import {
  authController,
  validateRegister,
  validateLogin,
  validatePasswordReset,
} from '../controllers/authController';
import { authLimiter } from '../config/rateLimiter';
import { authenticate } from '../middleware/authenticate';
import { wrapAsync } from '../utils/asyncHandler';

const router = Router();

// Public routes
router.post(
  '/register',
  validateRegister,
  wrapAsync(authController.register)
);

router.post(
  '/login',
  authLimiter,
  validateLogin,
  wrapAsync(authController.login)
);

router.get(
  '/verify-email',
  wrapAsync(authController.verifyEmail)
);

router.post(
  '/forgot-password',
  authLimiter,
  wrapAsync(authController.requestPasswordReset)
);

router.post(
  '/reset-password',
  authLimiter,
  validatePasswordReset,
  wrapAsync(authController.resetPassword)
);

router.post(
  '/refresh-token',
  wrapAsync(authController.refreshToken)
);

// Protected routes
router.post(
  '/logout',
  authenticate,
  wrapAsync(authController.logout)
);

export default router;
