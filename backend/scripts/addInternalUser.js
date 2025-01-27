const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function addInternalUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    const existingUser = await User.findOne({ 
      $or: [
        { email: 'nico@flegm.fr' },
        { username: 'nico_internal' }
      ]
    });

    if (existingUser) {
      console.log('Utilisateur interne existe déjà');
      return;
    }

    const internalUser = new User({
      username: 'nico_internal',
      email: 'nico@flegm.fr',
      password: 'FlegmInterne2024!', // Mot de passe sécurisé
      isCreator: true, // Donner des privilèges d'administrateur
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=nico_internal`
    });

    await internalUser.save();
    console.log('Utilisateur interne créé avec succès');
    console.log('Email:', internalUser.email);
    console.log('Mot de passe:', 'FlegmInterne2024!');
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur interne:', error);
  } finally {
    await mongoose.connection.close();
  }
}

addInternalUser(); 