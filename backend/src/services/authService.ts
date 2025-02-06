import bcrypt from 'bcrypt';
import { User, IUser } from '../models/User';
import { jwtService } from './jwtService';
import { emailService } from './emailService';
import { cacheService } from './cacheService';
import logger from '../config/logger';

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

class AuthService {
  private readonly SALT_ROUNDS = 10;
  private readonly VERIFICATION_TOKEN_TTL = 24 * 60 * 60; // 24 hours
  private readonly PASSWORD_RESET_TOKEN_TTL = 60 * 60; // 1 hour

  public async register(input: RegisterInput): Promise<IUser> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email: input.email }, { username: input.username }],
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const user = new User({
        username: input.username,
        email: input.email,
        password: input.password,
      });

      // Save user
      await user.save();

      // Generate verification token
      const verificationToken = jwtService.generateEmailVerificationToken(user._id);

      // Store token in cache
      await cacheService.set(
        `verification:${user._id}`,
        verificationToken,
        this.VERIFICATION_TOKEN_TTL
      );

      // Send verification email
      await emailService.sendVerificationEmail(user.email, verificationToken);

      // Send welcome email
      await emailService.sendWelcomeEmail(user.email, user.username);

      return user;
    } catch (error) {
      logger.error('Error in register service:', error);
      throw error;
    }
  }

  public async login(input: LoginInput): Promise<{
    user: IUser;
    token: string;
    refreshToken: string;
  }> {
    try {
      // Find user
      const user = await User.findOne({ email: input.email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isValidPassword = await user.comparePassword(input.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Check if user is verified
      if (!user.isVerified) {
        throw new Error('Please verify your email first');
      }

      // Generate tokens
      const token = jwtService.generateToken({
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = jwtService.generateRefreshToken(user._id);

      return { user, token, refreshToken };
    } catch (error) {
      logger.error('Error in login service:', error);
      throw error;
    }
  }

  public async verifyEmail(token: string): Promise<void> {
    try {
      const payload = jwtService.verifyToken(token);
      const user = await User.findById(payload.userId);

      if (!user) {
        throw new Error('User not found');
      }

      if (user.isVerified) {
        throw new Error('Email already verified');
      }

      user.isVerified = true;
      await user.save();

      // Remove verification token from cache
      await cacheService.delete(`verification:${user._id}`);
    } catch (error) {
      logger.error('Error in verifyEmail service:', error);
      throw error;
    }
  }

  public async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const resetToken = jwtService.generatePasswordResetToken(user._id);

      // Store token in cache
      await cacheService.set(
        `password-reset:${user._id}`,
        resetToken,
        this.PASSWORD_RESET_TOKEN_TTL
      );

      // Send password reset email
      await emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      logger.error('Error in requestPasswordReset service:', error);
      throw error;
    }
  }

  public async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = jwtService.verifyToken(token);
      const user = await User.findById(payload.userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();

      // Remove reset token from cache
      await cacheService.delete(`password-reset:${user._id}`);
    } catch (error) {
      logger.error('Error in resetPassword service:', error);
      throw error;
    }
  }

  public async refreshToken(refreshToken: string): Promise<string> {
    try {
      const payload = jwtService.verifyToken(refreshToken);
      const user = await User.findById(payload.userId);

      if (!user) {
        throw new Error('User not found');
      }

      return jwtService.generateToken({
        userId: user._id,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      logger.error('Error in refreshToken service:', error);
      throw error;
    }
  }

  public async logout(userId: string): Promise<void> {
    try {
      // Implement any necessary cleanup
      await cacheService.delete(`session:${userId}`);
    } catch (error) {
      logger.error('Error in logout service:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
