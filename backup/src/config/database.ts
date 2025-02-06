import mongoose from 'mongoose';
import logger from './logger';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI, {
      retryWrites: true,
      w: 'majority',
      ssl: process.env.NODE_ENV === 'production'
    });

    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error:', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};

// Gestion des événements de connexion mongoose
mongoose.connection.on('disconnected', () => {
  logger.warn('Disconnected from MongoDB');
});

mongoose.connection.on('error', (error) => {
  logger.error('MongoDB connection error:', { error });
});

export default connectDB; 