require('dotenv').config();
const express = require('express');
const compression = require('compression');
const mongoose = require('mongoose');
const cors = require('cors');
const { securityConfig } = require('./middleware/security');
const path = require('path');
const routes = require('./routes');

const app = express();

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

// Middleware de sécurité
app.use(cors(corsOptions));
app.use(...securityConfig);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Gestion des erreurs MongoDB
mongoose.connection.on('error', (err) => {
  console.error('Erreur MongoDB:', err);
});

// Réessayer la connexion en cas d'échec
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
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

// Routes API
app.use('/api', routes);

// Gestion des erreurs 404
app.use((req, res) => {
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