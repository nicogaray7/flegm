import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { Server } from 'http';

import logger from './config/logger';
import configurePassport from './config/passport';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import healthRoutes from './routes/health';

const app = express();
const PORT = process.env.PORT || 8080;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/flegm';
const JWT_SECRET = process.env.JWT_SECRET || 'a24879cf2123968828dcf5a2266fb809a5b7d0ea1713045e62fd07f9a6841494';

// Security middleware
app.use(helmet());
app.use(compression());

// CORS Configuration
app.use(cors({
  origin: [
    'https://flegm.fr',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rate limiting
app.use(rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100')
}));

// Request slowdown
app.use(slowDown({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  delayAfter: 50,
  delayMs: () => 500
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
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
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
configurePassport();

// Routes
app.use('/auth', authRoutes);
app.use('/health', healthRoutes);

// Error handling
app.use(errorHandler);

// Database connection and server startup
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
      server.close(() => {
        mongoose.connection.close(false, () => {
          process.exit(0);
        });
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

export { app }; 