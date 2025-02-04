import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import session from 'express-session';

import logger from './src/config/logger';
import connectDB from './src/config/database';
import configurePassport from './src/config/passport';
import { errorHandler } from './src/middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());

// Compression des réponses
app.use(compression());

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
app.use(cors(corsOptions));

// Limitation du taux de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limite de 100 requêtes par fenêtre
});
app.use(limiter);

// Ralentissement des requêtes
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Autoriser 50 requêtes normales
  delayMs: 500 // Ajouter 500ms de délai par requête supplémentaire
});
app.use(speedLimiter);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration de la session
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuration des stratégies Passport
configurePassport();

// Routes
app.use('/auth', authRoutes);

// Gestion des routes non trouvées
app.use((req, res, next) => {
  const error = new Error('Route non trouvée');
  (error as any).statusCode = 404;
  next(error);
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Démarrage du serveur
const startServer = async (): Promise<void> => {
  try {
    // Connexion à la base de données
    await connectDB();

    // Démarrage du serveur
    app.listen(PORT, () => {
      logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    logger.error('Échec du démarrage du serveur', { 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
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