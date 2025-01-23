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
const { securityConfig } = require('./middleware/security');
const path = require('path');
const routes = require('./routes');
const healthRoutes = require('./routes/health');

const app = express();

// Log toutes les routes disponibles
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Compression gzip
app.use(compression());

// Cache statique
app.use(express.static('public', {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// Optimisation MongoDB
mongoose.set('bufferCommands', false);
mongoose.set('autoIndex', false);

// Configuration CORS sécurisée
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 3600
};

// Debug CORS
app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);
  console.log('CORS allowed:', corsOptions.origin);
  next();
});

// Middleware de sécurité
app.use(cors(corsOptions));
app.use(...securityConfig);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Gestion des erreurs MongoDB
mongoose.connection.on('error', (err) => {
  console.error('Erreur MongoDB:', err);
  if (err.name === 'MongoServerSelectionError') {
    console.error('Détails de l\'erreur de connexion:', err.reason);
  }
  if (err.code === 'ECONNREFUSED') {
    console.error('Connexion refusée. Vérifiez le pare-feu et les règles de sécurité MongoDB Atlas');
  }
  if (err.message.includes('ssl')) {
    console.error('Erreur SSL. Vérifiez la configuration SSL/TLS');
  }
});

// Vérification des variables d'environnement critiques
if (!process.env.MONGODB_URI) {
  console.error('ERREUR CRITIQUE: Variable d\'environnement MONGODB_URI non définie');
  process.exit(1);
}

console.log('MongoDB URI définie:', !!process.env.MONGODB_URI);
console.log('MongoDB URI commence par:', process.env.MONGODB_URI?.substring(0, 20) + '...');

// Réessayer la connexion en cas d'échec
const connectWithRetry = () => {
  const uri = process.env.MONGODB_URI;
  console.log('Tentative de connexion à MongoDB...');
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 75000,
    ssl: true,
    sslValidate: true,
    retryWrites: true,
    w: 'majority',
    authSource: 'admin',
    replicaSet: 'atlas-jxnsm6-shard-0',
    tls: true
  })
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
    console.error('URI utilisée (début):', uri?.substring(0, 20) + '...');
    if (err.name === 'MongoServerSelectionError') {
      console.error('Détails de l\'erreur de connexion:', err.reason);
    }
    console.log('Nouvelle tentative dans 5 secondes...');
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

// Middleware de logging sécurisé
app.use((req, res, next) => {
  const sanitizedUrl = req.url.replace(/[<>'"]/g, '');
  console.log(`${new Date().toISOString()} - ${req.method} ${sanitizedUrl}`);
  next();
});

// Route de health check
app.use('/api/health', healthRoutes);

// Routes API
app.use('/', routes);

// Gestion des erreurs 404
app.use((req, res) => {
  console.log(`404 - Route non trouvée: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu. Arrêt gracieux...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Serveur arrêté');
      process.exit(0);
    });
  });
}); 