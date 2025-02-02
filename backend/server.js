require('dotenv').config();

// Vérification de la version de Node.js
const nodeVersion = process.version;
console.log('Version de Node.js:', nodeVersion);
if (!nodeVersion.startsWith('v18')) {
  console.warn('Attention: La version recommandée de Node.js est v18.x');
}

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
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));

// Configuration CORS
const corsMiddleware = cors(corsOptions);
app.use(corsMiddleware);
app.options('*', corsMiddleware);

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
app.use('/api/health', healthRoutes);
app.use('/api', routes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(500).json({ message: 'Erreur serveur', details: err.message });
});

// Connexion MongoDB et démarrage du serveur
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✅ Connexion réussie à MongoDB');
    
    // Middleware de logging en développement
    if (process.env.NODE_ENV === 'development') {
      app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        next();
      });
    }

    const PORT = process.env.PORT || 8080;
    const server = app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur le port ${PORT}`);
    });

    // Gestion gracieuse de l'arrêt
    const gracefulShutdown = async () => {
      console.log('Arrêt gracieux...');
      try {
        await mongoose.connection.close();
        await new Promise((resolve) => server.close(resolve));
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