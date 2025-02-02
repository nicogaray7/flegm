import { ConnectOptions } from 'mongoose';

export const mongooseOptions: ConnectOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  w: 'majority',
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '20'),
  minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '5'),
};
