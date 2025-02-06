import { cleanEnv, str, port, url, num } from 'envalid';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define environment variables schema
export const env = cleanEnv(process.env, {
  // Server configuration
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  PORT: port({ default: 3000 }),
  API_URL: url(),
  FRONTEND_URL: url(),

  // Database configuration
  MONGODB_URI: url(),

  // Redis configuration
  REDIS_URL: str({ default: 'redis://localhost:6379' }),

  // JWT configuration
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '7d' }),

  // Session configuration
  SESSION_SECRET: str(),

  // OAuth configuration
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
  GOOGLE_CALLBACK_URL: url(),
  FACEBOOK_APP_ID: str(),
  FACEBOOK_APP_SECRET: str(),
  FACEBOOK_CALLBACK_URL: url(),

  // Rate limiting
  RATE_LIMIT_WINDOW: num({ default: 15 * 60 * 1000 }), // 15 minutes
  RATE_LIMIT_MAX: num({ default: 100 }), // 100 requests per window

  // CORS
  CORS_ORIGIN: str({ default: '*' }),

  // Email configuration
  SMTP_HOST: str({ default: 'smtp.gmail.com' }),
  SMTP_PORT: port({ default: 587 }),
  SMTP_USER: str({ default: '' }),
  SMTP_PASS: str({ default: '' }),

  // AWS S3 configuration
  AWS_ACCESS_KEY_ID: str({ default: '' }),
  AWS_SECRET_ACCESS_KEY: str({ default: '' }),
  AWS_REGION: str({ default: 'us-east-1' }),
  AWS_BUCKET_NAME: str({ default: '' }),
});
