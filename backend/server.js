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
app.use(cors(corsOptions));
app.use(...securityConfig);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par fenêtre
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // ralentir après 50 requêtes
  delayMs: 500 // ajouter 500ms de délai par requête
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

// Connexion MongoDB et démarrage du serveur
async function startServer() {
  try {
    console.log('Tentative de connexion à MongoDB Atlas...');
    console.log('URI de connexion:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('Connecté à MongoDB Atlas avec succès');
    
    // Middleware de logging en développement
    if (process.env.NODE_ENV === 'development') {
      app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        next();
      });
    }

    // Routes
    app.use('/api/health', healthRoutes);
    app.use('/api/auth', require('./routes/auth'));
    app.use('/', routes);

    // Gestion des erreurs 404
    app.use((req, res) => {
      res.status(404).json({ message: 'Route non trouvée' });
    });

    // Gestion des erreurs globale
    app.use((err, req, res, next) => {
      console.error('Erreur:', err);
      res.status(500).json({ message: 'Erreur serveur', details: err.message });
    });

    const PORT = process.env.PORT || 5001;
    const server = app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
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
    console.error('❌ Erreur de connexion à MongoDB:', err);
    process.exit(1);
  }
};

startServer(); 