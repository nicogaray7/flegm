import 'dotenv/config';
import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import type { RequestHandler, ErrorRequestHandler } from 'express-serve-static-core';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

import logger from '@config/logger';
import configurePassport from '@config/passport';
import { errorHandler } from '@middleware/errorHandler';
import authRoutes from '@routes/auth';
import healthRoutes from '@routes/health';

const app: Express = express();
const PORT = process.env.PORT || 8080;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/flegm';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Security middleware
const securityMiddleware = [
  helmet(),
  compression(),
  cors({
    origin: [
      'https://flegm.fr',
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }),
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100')
  })
];

// Apply security middleware
securityMiddleware.forEach(middleware => {
  app.use(middleware as unknown as RequestHandler);
});

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
const sessionMiddleware = session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUri,
    ttl: parseInt(process.env.CACHE_TTL || '3600')
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
});

// Apply session and auth middleware
app.use(sessionMiddleware as unknown as RequestHandler);
app.use(passport.initialize() as unknown as RequestHandler);
app.use(passport.session() as unknown as RequestHandler);
configurePassport();

// Routes
app.use('/auth', authRoutes);
app.use('/health', healthRoutes);

// Error handling
const errorMiddleware: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
};
app.use(errorMiddleware);

// Database connection and server startup
function startServer() {
  mongoose.connect(mongoUri, {
    maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '20'),
    minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '5'),
    serverSelectionTimeoutMS: parseInt(process.env.MONGODB_TIMEOUT_MS || '30000'),
  })
    .then(() => {
      logger.info('Connected to MongoDB');
      const server = app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });

      // Graceful shutdown
      const shutdown = () => {
        logger.info('Shutting down server...');
        server.close(async () => {
          await mongoose.connection.close();
          process.exit(0);
        });
      };

      process.on('SIGINT', shutdown);
      process.on('SIGTERM', shutdown);
    })
    .catch((error) => {
      logger.error('MongoDB connection error:', error);
      process.exit(1);
    });
}

startServer();

export { app }; 