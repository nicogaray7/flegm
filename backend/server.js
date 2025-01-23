require('dotenv').config();
const express = require('express');
const compression = require('compression');
const mongoose = require('mongoose');
const cors = require('cors');
const { securityConfig } = require('./middleware/security');
const path = require('path');

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

// Connection à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  authSource: 'admin',
  retryWrites: true,
  w: 'majority'
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Middleware de logging sécurisé
app.use((req, res, next) => {
  const sanitizedUrl = req.url.replace(/[<>'"]/g, '');
  console.log(`${new Date().toISOString()} - ${req.method} ${sanitizedUrl}`);
  next();
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/health', require('./routes/health'));

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