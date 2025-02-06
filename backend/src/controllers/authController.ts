import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/authService';
import logger from '../config/logger';

export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
    .withMessage(
      'Password must contain at least one number, one lowercase and one uppercase letter'
    ),
];

export const validateLogin = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validatePasswordReset = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
    .withMessage(
      'Password must contain at least one number, one lowercase and one uppercase letter'
    ),
];

class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 'error',
          errors: errors.array(),
        });
        return;
      }

      const { username, email, password } = req.body;
      const user = await authService.register({ username, email, password });

      res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: 'Registration successful. Please check your email for verification.',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
          },
        },
      });
    } catch (error) {
      logger.error('Error in register controller:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 'error',
          errors: errors.array(),
        });
        return;
      }

      const { email, password } = req.body;
      const { user, token, refreshToken } = await authService.login({ email, password });

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      logger.error('Error in login controller:', error);
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Login failed',
      });
    }
  }

  public async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 'error',
          message: 'Verification token is required',
        });
        return;
      }

      await authService.verifyEmail(token);

      res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Email verified successfully',
      });
    } catch (error) {
      logger.error('Error in verifyEmail controller:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Email verification failed',
      });
    }
  }

  public async requestPasswordReset(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 'error',
          message: 'Email is required',
        });
        return;
      }

      await authService.requestPasswordReset(email);

      res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Password reset instructions sent to your email',
      });
    } catch (error) {
      logger.error('Error in requestPasswordReset controller:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Password reset request failed',
      });
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 'error',
          errors: errors.array(),
        });
        return;
      }

      const { token } = req.query;
      const { password } = req.body;

      if (!token || typeof token !== 'string') {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 'error',
          message: 'Reset token is required',
        });
        return;
      }

      await authService.resetPassword(token, password);

      res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Password reset successful',
      });
    } catch (error) {
      logger.error('Error in resetPassword controller:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Password reset failed',
      });
    }
  }

  public async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: 'error',
          message: 'Refresh token is required',
        });
        return;
      }

      const newToken = await authService.refreshToken(refreshToken);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
          token: newToken,
        },
      });
    } catch (error) {
      logger.error('Error in refreshToken controller:', error);
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Token refresh failed',
      });
    }
  }

  public async logout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      await authService.logout(userId);

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Logout successful',
      });
    } catch (error) {
      logger.error('Error in logout controller:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Logout failed',
      });
    }
  }
}

export const authController = new AuthController();
