require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function initUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    // Supprimer l'utilisateur s'il existe déjà
    await User.deleteOne({ email: 'lucas@flegm.fr' });

    // Créer le nouvel utilisateur
    const user = await User.create({
      username: 'lucas',
      email: 'lucas@flegm.fr',
      password: 'Test123!',
      isCreator: true
    });

    console.log('Utilisateur créé avec succès:', user);
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

initUser(); 