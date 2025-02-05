import mongoose from 'mongoose';
import logger from './logger';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI n\'est pas défini dans les variables d\'environnement');
    }

    logger.info('🔄 Tentative de connexion à MongoDB avec l\'URI:', mongoURI);

    await mongoose.connect(mongoURI, {
      // Options de connexion recommandées
      retryWrites: true,
      w: 'majority',
      
      // Options de sécurité et de performance
      authSource: 'admin',
      ssl: true,
      
      // Options de gestion de connexion
      serverSelectionTimeoutMS: 5000, // Délai de sélection du serveur
      socketTimeoutMS: 45000, // Délai de socket
      family: 4 // Forcer IPv4
    });

    logger.info('✅ Connexion à MongoDB réussie');
  } catch (error) {
    logger.error('❌ Échec de la connexion à MongoDB', { 
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Arrêter le processus en cas d'échec de connexion
    process.exit(1);
  }
};

// Gestion des événements de connexion mongoose
mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ Déconnexion de MongoDB');
});

mongoose.connection.on('reconnected', () => {
  logger.info('✅ Reconnexion à MongoDB réussie');
});

mongoose.connection.on('error', (error) => {
  logger.error('❌ Erreur de connexion MongoDB', { error });
});

export default connectDB; 