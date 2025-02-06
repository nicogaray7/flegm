import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { StatusCodes } from 'http-status-codes';
import { RequestHandler } from 'express-serve-static-core';

import { env } from './config/env';
import { limiter } from './config/rateLimiter';
import { configureSession } from './config/session';
import connectDB from './config/database';
import { connectRedis } from './config/redis';
import logger from './config/logger';

// Import routes
import authRoutes from './routes/auth';
import healthRoutes from './routes/health';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

class App {
  public app: Express;
  private server: ReturnType<Express['listen']> | null = null;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet() as unknown as RequestHandler);
    this.app.use(
      cors({
        origin: env.CORS_ORIGIN,
        credentials: true,
      })
    );
    this.app.use(limiter as unknown as RequestHandler);

    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Cookie parsing middleware
    this.app.use(cookieParser());

    // Compression middleware
    this.app.use(compression() as unknown as RequestHandler);

    // Session middleware
    this.app.use(configureSession() as unknown as RequestHandler);

    // Passport middleware
    this.app.use(passport.initialize() as unknown as RequestHandler);
    this.app.use(passport.session() as unknown as RequestHandler);

    // Logging middleware for requests
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/health', healthRoutes);

    // Base route
    this.app.get('/', (_req: Request, res: Response) => {
      res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Welcome to the API',
        version: '1.0.0',
      });
    });
  }

  private initializeErrorHandling(): void {
    // Handle 404 errors
    this.app.use(notFoundHandler);

    // Handle all other errors
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to MongoDB
      await connectDB();

      // Connect to Redis
      await connectRedis();

      // Start server
      const port = env.PORT || 3000;
      this.server = this.app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
        logger.info(`Environment: ${env.NODE_ENV}`);
      });

      // Handle graceful shutdown
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
      process.on('SIGINT', this.gracefulShutdown.bind(this));
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async gracefulShutdown(): Promise<void> {
    try {
      logger.info('Received shutdown signal. Starting graceful shutdown...');

      // Close server
      if (this.server) {
        logger.info('Closing HTTP server...');
        await new Promise<void>((resolve) => {
          this.server?.close(() => {
            logger.info('HTTP server closed');
            resolve();
          });
        });
      }

      // Perform cleanup
      logger.info('Cleaning up resources...');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  }
}

export default App;
