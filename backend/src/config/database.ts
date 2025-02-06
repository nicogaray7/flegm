import mongoose from 'mongoose';
import logger from './logger';
import { env } from './env';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Critical security and data integrity options
      retryWrites: true,
      w: 'majority',
      authSource: 'admin',
      ssl: true,
      family: 4, // Force IPv4
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.info('Mongoose connection disconnected');
    });

    // Handle process termination
    process.on('SIGINT', () => {
      void mongoose.connection
        .close()
        .then(() => {
          logger.info('Mongoose connection closed through app termination');
          process.exit(0);
        })
        .catch((err) => {
          logger.error('Error closing Mongoose connection:', err);
          process.exit(1);
        });
    });
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
