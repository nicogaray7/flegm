import { RedisClientType as BaseRedisClientType, RedisClientOptions } from 'redis';

export interface RedisClientTypeCustom extends BaseRedisClientType {
  isReady: boolean;
}

export interface RedisStoreOptions {
  client: RedisClientTypeCustom;
  prefix?: string;
  ttl?: number;
  disableTouch?: boolean;
}

declare module 'connect-redis' {
  import session from 'express-session';
  import { RedisStoreOptions } from './redis';

  export default function connectRedis(session: typeof import('express-session')): {
    new (options: RedisStoreOptions): session.Store;
  };
}

// Extend express-session
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    isAuthenticated?: boolean;
    [key: string]: any;
  }
} 