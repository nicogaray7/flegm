import { RedisClientType, RedisClientOptions } from 'redis';

// Custom Redis client type with isReady property
export interface RedisClientTypeCustom extends RedisClientType {
  isReady: boolean;
}

// Redis store options type
export interface RedisStoreOptions {
  client: RedisClientTypeCustom;
  prefix?: string;
  ttl?: number;
  disableTouch?: boolean;
}

// Extend the RedisClientOptions to include our custom properties
export interface CustomRedisClientOptions extends RedisClientOptions {
  socket?: {
    reconnectStrategy?: (retries: number) => number | Error;
  };
}

// Type guard for Redis client
export function isRedisClientTypeCustom(client: unknown): client is RedisClientTypeCustom {
  return (
    client !== null &&
    typeof client === 'object' &&
    'isReady' in client &&
    typeof (client as RedisClientTypeCustom).isReady === 'boolean'
  );
} 