import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import logger from '../config/logger';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

class JWTService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = env.JWT_SECRET;
    this.expiresIn = env.JWT_EXPIRES_IN;
  }

  public generateToken(payload: TokenPayload): string {
    try {
      return jwt.sign(payload, this.secret, {
        expiresIn: this.expiresIn,
      });
    } catch (error) {
      logger.error('Error generating JWT token:', error);
      throw new Error('Failed to generate token');
    }
  }

  public verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.secret) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        logger.warn('JWT token expired');
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        logger.warn('Invalid JWT token');
        throw new Error('Invalid token');
      }
      logger.error('Error verifying JWT token:', error);
      throw new Error('Failed to verify token');
    }
  }

  public generateRefreshToken(userId: string): string {
    try {
      return jwt.sign({ userId }, this.secret, {
        expiresIn: '7d', // Refresh token valid for 7 days
      });
    } catch (error) {
      logger.error('Error generating refresh token:', error);
      throw new Error('Failed to generate refresh token');
    }
  }

  public generateEmailVerificationToken(userId: string): string {
    try {
      return jwt.sign({ userId, type: 'email-verification' }, this.secret, {
        expiresIn: '24h', // Email verification token valid for 24 hours
      });
    } catch (error) {
      logger.error('Error generating email verification token:', error);
      throw new Error('Failed to generate email verification token');
    }
  }

  public generatePasswordResetToken(userId: string): string {
    try {
      return jwt.sign({ userId, type: 'password-reset' }, this.secret, {
        expiresIn: '1h', // Password reset token valid for 1 hour
      });
    } catch (error) {
      logger.error('Error generating password reset token:', error);
      throw new Error('Failed to generate password reset token');
    }
  }

  public decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (error) {
      logger.error('Error decoding JWT token:', error);
      return null;
    }
  }
}

export const jwtService = new JWTService();
