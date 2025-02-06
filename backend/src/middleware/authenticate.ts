import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { jwtService } from '../services/jwtService';
import { User, IUser } from '../models/User';
import logger from '../config/logger';
import { AuthenticatedRequest } from '../types/express';
import { AuthenticationError, AuthorizationError } from '../types/error';
import { asyncHandler } from '../utils/asyncHandler';

// Define the role type
export type UserRole = 'user' | 'admin';

// Type guard for IUser
function isIUser(user: unknown): user is IUser {
  return (
    user != null &&
    typeof user === 'object' &&
    'username' in user &&
    'email' in user &&
    'role' in user &&
    'isVerified' in user &&
    typeof (user as IUser).username === 'string' &&
    typeof (user as IUser).email === 'string' &&
    typeof (user as IUser).role === 'string' &&
    typeof (user as IUser).isVerified === 'boolean'
  );
}

export const authenticate = asyncHandler<ParamsDictionary>(async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError('No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwtService.verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user || !isIUser(user)) {
      throw new AuthenticationError('User not found or invalid');
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    throw new AuthenticationError('Invalid token');
  }
});

export const authorize = (...roles: UserRole[]) => {
  return asyncHandler<ParamsDictionary>(async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user || !isIUser(req.user)) {
      throw new AuthenticationError('Not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError();
    }

    next();
  });
};

// Type guard for authenticated request
export function isAuthenticatedRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
>(
  req: Request<P, ResBody, ReqBody, ReqQuery, Locals>
): req is AuthenticatedRequest<P, ResBody, ReqBody, ReqQuery, Locals> {
  return req.user !== undefined && isIUser(req.user);
}

// Middleware to ensure request is authenticated
export const requireAuth = asyncHandler<ParamsDictionary>(async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  if (!isAuthenticatedRequest(req)) {
    throw new AuthenticationError('Not authenticated');
  }
  next();
});
