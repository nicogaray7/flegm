import session from 'express-session';
import connectRedis from 'connect-redis';
import { RequestHandler } from 'express';
import { env } from './env';
import redisClient from './redis';
import logger from './logger';
import { RedisStoreOptions } from '../types/redis';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    isAuthenticated?: boolean;
  }
}

const ONE_DAY = 1000 * 60 * 60 * 24;

// Create RedisStore
const RedisStore = connectRedis(session);

// Configure session options
const sessionConfig: session.SessionOptions = {
  store: new RedisStore({
    client: redisClient,
    prefix: 'session:',
    ttl: ONE_DAY / 1000, // Convert to seconds
    disableTouch: false,
  } satisfies RedisStoreOptions),
  secret: env.SESSION_SECRET,
  name: 'sid',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: ONE_DAY,
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
    domain: env.NODE_ENV === 'production' ? env.COOKIE_DOMAIN : undefined,
  },
  proxy: env.NODE_ENV === 'production',
};

// Configure session middleware with proper error handling
export const configureSession = (): RequestHandler => {
  if (env.NODE_ENV === 'production') {
    logger.info('Configuring secure session in production mode');
  } else {
    logger.info('Configuring session in development mode');
  }

  const sessionHandler = session(sessionConfig);

  return (req, res, next) => {
    try {
      sessionHandler(req, res, (err) => {
        if (err) {
          logger.error('Session middleware error:', err);
          next(err);
          return;
        }
        next();
      });
    } catch (error) {
      logger.error('Session configuration error:', error);
      next(error);
    }
  };
};

export default configureSession;
