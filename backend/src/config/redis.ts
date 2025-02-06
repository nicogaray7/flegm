import { createClient } from 'redis';
import logger from './logger';
import { env } from './env';
import { RedisClientTypeCustom } from '../types/redis';

const redisClient = createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries: number) => {
      if (retries > 10) {
        logger.error('Redis max retries reached. Exiting...');
        process.exit(1);
      }
      return Math.min(retries * 100, 3000);
    },
  },
}) as RedisClientTypeCustom;

// Add isReady property
Object.defineProperty(redisClient, 'isReady', {
  writable: true,
  value: false,
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
  redisClient.isReady = false;
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

redisClient.on('ready', () => {
  logger.info('Redis Client Ready');
  redisClient.isReady = true;
});

redisClient.on('end', () => {
  logger.info('Redis Client Connection Ended');
  redisClient.isReady = false;
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Redis Connection Error:', error);
    process.exit(1);
  }
};

// Graceful shutdown handler
const handleShutdown = async (): Promise<void> => {
  try {
    if (redisClient.isReady) {
      await redisClient.quit();
      logger.info('Redis connection closed through app termination');
    }
  } catch (err) {
    logger.error('Error closing Redis connection:', err);
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', () => void handleShutdown());
process.on('SIGTERM', () => void handleShutdown());

export default redisClient;
