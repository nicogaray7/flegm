import 'dotenv/config';
import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import session from 'express-session';
import Redis from 'ioredis';
import { RedisStore } from 'connect-redis';

import logger from './config/logger';
import connectDB from './config/database';
import configurePassport from './config/passport';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import healthRoutes from './routes/health';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Configuration des middlewares de sécurité
app.use(helmet() as unknown as express.RequestHandler);
app.use(compression() as unknown as express.RequestHandler);

// Configuration CORS
const corsOptions = {
  origin: [
    'https://flegm.fr', 
    'http://localhost:3000', 
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions) as unknown as express.RequestHandler);

// Limitation du taux de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limite de 100 requêtes par fenêtre
});
app.use(limiter as unknown as express.RequestHandler);

// Ralentissement des requêtes
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Autoriser 50 requêtes normales
  delayMs: () => 500, // Délai fixe de 500ms
  validate: { delayMs: false } // Désactiver l'avertissement
});
app.use(speedLimiter as unknown as express.RequestHandler);

// Parsers
app.use(express.json() as unknown as express.RequestHandler);
app.use(express.urlencoded({ extended: true }) as unknown as express.RequestHandler);

// Configuration de la session
let sessionConfig: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
};

// En production, on utilise Redis comme store de session
if (process.env.NODE_ENV === 'production') {
  const redisClient = new Redis(process.env.REDIS_URL || '');

  redisClient.on('error', (err) => {
    logger.error('Erreur Redis:', err);
  });

  redisClient.on('connect', () => {
    logger.info('✅ Connecté à Redis');
  });

  sessionConfig.store = new RedisStore({ client: redisClient });
} else {
  logger.warn('⚠️ Utilisation du store de session en mémoire - Ne pas utiliser en production');
}

app.use(session(sessionConfig) as unknown as express.RequestHandler);

// Initialisation de Passport
app.use(passport.initialize() as unknown as express.RequestHandler);
app.use(passport.session() as unknown as express.RequestHandler);

// Configuration des stratégies Passport
configurePassport();

// Routes
app.use('/auth', authRoutes);
app.use('/api', healthRoutes);

// Gestion des routes non trouvées
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error('Route non trouvée');
  (error as any).statusCode = 404;
  next(error);
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Démarrage du serveur
const startServer = async (): Promise<void> => {
  try {
    logger.info('🔄 Démarrage du serveur...');
    
    // Connexion à la base de données
    logger.info('🔄 Connexion à la base de données...');
    await connectDB();
    logger.info('✅ Connecté à la base de données');

    // Démarrage du serveur
    app.listen(PORT, () => {
      logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    logger.error('❌ Échec du démarrage du serveur', { 
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
  }
};

// Gestion des signaux de fermeture
process.on('SIGINT', () => {
  logger.info('Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Arrêt du serveur...');
  process.exit(0);
});

// Lancement du serveur
startServer(); 