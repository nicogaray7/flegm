require('dotenv').config();

// Logging de démarrage
console.log('🚀 Démarrage du serveur...');
console.log('📊 Variables d\'environnement:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('- CORS_ORIGINS:', process.env.CORS_ORIGINS);

const express = require('express');
const compression = require('compression');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { securityConfig } = require('./middleware/security');
const { corsOptions, mongooseOptions, expressConfig } = require('./config/server');
const routes = require('./routes');
const healthRoutes = require('./routes/health');

const app = express();

// Middleware de sécurité de base
console.log('🔒 Configuration de la sécurité...');
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));

// Configuration CORS
console.log('🌍 Configuration CORS...');
console.log('Options CORS:', JSON.stringify(corsOptions, null, 2));
console.log('Frontend URL:', process.env.FRONTEND_URL);
console.log('Environment:', process.env.NODE_ENV);

const corsMiddleware = cors(corsOptions);
app.use((req, res, next) => {
  console.log('📨 Requête reçue:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    headers: req.headers
  });
  next();
});
app.use(corsMiddleware);
app.options('*', corsMiddleware);

// Middleware pour forcer le Content-Type JSON pour les routes API
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.use(...securityConfig);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100
});

const speedLimiter = slowDown({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: 500
});

app.use(limiter);
app.use(speedLimiter);

// Middleware de base
app.use(compression());
app.use(express.json({ limit: expressConfig.jsonLimit }));
app.use(express.urlencoded({ extended: true, limit: expressConfig.urlEncodedLimit }));
app.use(express.static('public', expressConfig.staticOptions));

// Optimisation MongoDB
mongoose.set('bufferCommands', false);
mongoose.set('autoIndex', process.env.NODE_ENV !== 'production');

// Routes
console.log('🛣️ Configuration des routes...');
app.use('/api/health', healthRoutes);
app.use('/api', routes);

// Logging des requêtes en production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.headers['user-agent'],
        ip: req.ip
      }));
    });
    next();
  });
}

// Gestion des erreurs 404
app.use((req, res) => {
  console.log('❌ Route non trouvée:', req.url);
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({ message: 'Erreur serveur', details: err.message });
});

// Connexion MongoDB et démarrage du serveur
const startServer = async () => {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✅ Connexion réussie à MongoDB');
    
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur le port ${PORT}`);
      console.log('🌐 URL du frontend:', process.env.FRONTEND_URL);
      console.log('🔑 Origines CORS autorisées:', process.env.CORS_ORIGINS);
    });

    // Gestion gracieuse de l'arrêt
    const gracefulShutdown = async () => {
      console.log('Arrêt gracieux...');
      try {
        await mongoose.connection.close();
        process.exit(0);
      } catch (err) {
        console.error('Erreur lors de l\'arrêt:', err);
        process.exit(1);
      }
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (err) {
    console.error('❌ Erreur de démarrage:', err);
    process.exit(1);
  }
};

startServer(); 