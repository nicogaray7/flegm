import rateLimit, { RateLimitRequestHandler, Options } from 'express-rate-limit';
import { Request, Response } from 'express';
import { env } from './env';
import logger from './logger';
import express from 'express';

interface RateLimitOptions {
  prefix: string;
  windowMs: number;
  max: number;
  message: string;
}

const createLimiter = (options: RateLimitOptions): RateLimitRequestHandler => {
  const config: Partial<Options> = {
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
      logger.warn('Rate limit exceeded');
      res.status(429).json({
        status: 'error',
        message: options.message,
      });
    },
  };

  return rateLimit(config);
};

// Create a limiter with memory store
export const limiter = createLimiter({
  prefix: 'rate-limit:',
  windowMs: env.RATE_LIMIT_WINDOW,
  max: env.RATE_LIMIT_MAX,
  message: 'Too many requests from this IP, please try again later.',
}) as unknown as express.RequestHandler;

// Stricter limiter for auth routes
export const authLimiter = createLimiter({
  prefix: 'auth-rate-limit:',
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
}) as unknown as express.RequestHandler;
