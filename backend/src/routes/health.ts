import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import redisClient from '../config/redis';
import logger from '../config/logger';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    // Check MongoDB connection
    const isMongoConnected = mongoose.connection.readyState === 1;

    // Check Redis connection
    const isRedisConnected = redisClient.isReady;

    // Get uptime in seconds
    const uptime = process.uptime();

    // Format uptime
    const formatUptime = (seconds: number): string => {
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor((seconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = Math.floor(seconds % 60);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`);

      return parts.join(' ');
    };

    // Get memory usage
    const memoryUsage = process.memoryUsage();
    const formatMemory = (bytes: number): string => {
      return `${Math.round((bytes / 1024 / 1024) * 100) / 100} MB`;
    };

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: formatUptime(uptime),
      memory: {
        rss: formatMemory(memoryUsage.rss), // Resident Set Size
        heapTotal: formatMemory(memoryUsage.heapTotal), // V8's memory usage
        heapUsed: formatMemory(memoryUsage.heapUsed), // V8's memory usage
        external: formatMemory(memoryUsage.external), // C++ objects bound to JavaScript objects
      },
      services: {
        mongodb: {
          status: isMongoConnected ? 'connected' : 'disconnected',
          host: mongoose.connection.host,
        },
        redis: {
          status: isRedisConnected ? 'connected' : 'disconnected',
        },
      },
    };

    // Log health check
    logger.info('Health check performed', healthStatus);

    res.status(StatusCodes.OK).json(healthStatus);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      status: 'error',
      message: 'Service health check failed',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
