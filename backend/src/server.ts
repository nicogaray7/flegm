import express, { Request, Response, NextFunction } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// Configuration Mongoose avancée
const mongooseOptions: ConnectOptions = {
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '50', 10),
  minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '10', 10),
  connectTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT_MS || '30000', 10),
  socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT_MS || '45000', 10),
  ssl: process.env.MONGODB_SSL_ENABLED === 'true',
  sslValidate: process.env.MONGODB_SSL_VALIDATE === 'true'
};

// Connexion à MongoDB avec gestion des erreurs améliorée
mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('✅ Connecté à MongoDB Atlas avec succès');
  })
  .catch((err) => {
    console.error('❌ Échec de la connexion à MongoDB :', err);
    process.exit(1);
  });

// Gestion des événements de connexion
const db = mongoose.connection;
db.on('connected', () => console.log('🔗 Connexion MongoDB maintenue'));
db.on('error', (err) => console.error('❌ Erreur de connexion MongoDB :', err));
db.on('disconnected', () => console.warn('⚠️ Déconnexion de MongoDB'));

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://flegm.fr',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet()); // Sécurité HTTP
app.use(express.json()); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser les données de formulaire

// Routes
app.use('/api/auth', authRoutes);

// Gestion des erreurs globales
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erreur globale :', err.stack);
  res.status(500).send('Une erreur serveur est survenue');
});

// Démarrage du serveur
const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

// Gestion des arrêts gracieux
process.on('SIGTERM', () => {
  console.log('🛑 Arrêt du serveur en cours...');
  server.close(() => {
    mongoose.connection.close()
      .then(() => {
        console.log('📴 Connexions fermées');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Erreur lors de la fermeture de la connexion :', err);
        process.exit(1);
      });
  });
});

export default app; 