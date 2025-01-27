const mongoose = require('mongoose');
const InternalTeam = require('../models/InternalTeam');
require('dotenv').config();

async function addInternalTeamMember() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    const existingMember = await InternalTeam.findOne({ 
      $or: [
        { email: 'nico@flegm.fr' },
        { username: 'nico_internal' }
      ]
    });

    if (existingMember) {
      console.log('Membre de l\'équipe interne existe déjà');
      return;
    }

    const internalTeamMember = new InternalTeam({
      username: 'nico_internal',
      email: 'nico@flegm.fr',
      password: 'FlegmInterne2024!', // Mot de passe sécurisé
      role: 'admin', // Rôle administrateur
      permissions: ['full_access'], // Permissions complètes
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=nico_internal`
    });

    await internalTeamMember.save();
    console.log('Membre de l\'équipe interne créé avec succès');
    console.log('Email:', internalTeamMember.email);
    console.log('Rôle:', internalTeamMember.role);
  } catch (error) {
    console.error('Erreur lors de la création du membre de l\'équipe interne:', error);
  } finally {
    await mongoose.connection.close();
  }
}

addInternalTeamMember(); 