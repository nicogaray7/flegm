import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Charger les variables d'environnement de test
dotenv.config({ path: '.env.test' });

// Configuration globale des tests
beforeAll(async () => {
  // Connexion à la base de données de test
  const mongoURI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/flegm_test';
  await mongoose.connect(mongoURI);
});

afterAll(async () => {
  // Déconnexion de la base de données après les tests
  await mongoose.connection.close();
});

// Nettoyer la base de données avant chaque test
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}); 