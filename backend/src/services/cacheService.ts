import redisClient from '../config/redis';
import logger from '../config/logger';

class CacheService {
  private readonly defaultTTL: number = 3600; // 1 hour in seconds

  public async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Error retrieving data from cache:', error);
      return null;
    }
  }

  public async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await redisClient.set(key, stringValue, {
        EX: ttl,
      });
      logger.debug(`Cache set successfully for key: ${key}`);
    } catch (error) {
      logger.error('Error setting data in cache:', error);
    }
  }

  public async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);
      logger.debug(`Cache deleted successfully for key: ${key}`);
    } catch (error) {
      logger.error('Error deleting data from cache:', error);
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      return (await redisClient.exists(key)) === 1;
    } catch (error) {
      logger.error('Error checking cache existence:', error);
      return false;
    }
  }

  public async increment(key: string): Promise<number> {
    try {
      const value = await redisClient.incr(key);
      logger.debug(`Cache incremented successfully for key: ${key}`);
      return value;
    } catch (error) {
      logger.error('Error incrementing cache value:', error);
      throw error;
    }
  }

  public async decrement(key: string): Promise<number> {
    try {
      const value = await redisClient.decr(key);
      logger.debug(`Cache decremented successfully for key: ${key}`);
      return value;
    } catch (error) {
      logger.error('Error decrementing cache value:', error);
      throw error;
    }
  }

  public async setWithHash(hash: string, key: string, value: any): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await redisClient.hSet(hash, key, stringValue);
      logger.debug(`Cache hash set successfully for hash: ${hash}, key: ${key}`);
    } catch (error) {
      logger.error('Error setting hash data in cache:', error);
    }
  }

  public async getFromHash<T>(hash: string, key: string): Promise<T | null> {
    try {
      const data = await redisClient.hGet(hash, key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Error retrieving hash data from cache:', error);
      return null;
    }
  }

  public async deleteFromHash(hash: string, key: string): Promise<void> {
    try {
      await redisClient.hDel(hash, key);
      logger.debug(`Cache hash deleted successfully for hash: ${hash}, key: ${key}`);
    } catch (error) {
      logger.error('Error deleting hash data from cache:', error);
    }
  }

  public async clearCache(): Promise<void> {
    try {
      await redisClient.flushDb();
      logger.info('Cache cleared successfully');
    } catch (error) {
      logger.error('Error clearing cache:', error);
    }
  }
}

export const cacheService = new CacheService();
