require('dotenv').config();
const mongoose = require('mongoose');

async function cleanPosts() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    // Utiliser directement la collection posts
    const db = mongoose.connection.db;
    const result = await db.collection('posts').updateMany(
      {},
      { $unset: { description: 1 } }
    );

    console.log('Nettoyage terminé :', {
      matched: result.matchedCount,
      modified: result.modifiedCount
    });

  } catch (error) {
    console.error('Erreur lors du nettoyage :', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
    process.exit(0);
  }
}

cleanPosts(); 