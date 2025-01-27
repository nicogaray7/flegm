const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function resetUserPassword(email, newPassword) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    const user = await User.findOne({ email });

    if (!user) {
      console.error('❌ Utilisateur non trouvé');
      return false;
    }

    // Forcer la modification du mot de passe
    user.password = newPassword;
    await user.save();

    console.log('✅ Mot de passe réinitialisé avec succès');
    return true;

  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    return false;
  } finally {
    await mongoose.connection.close();
  }
}

// Utilisation : node resetUserPassword.js email@example.com nouveauMotDePasse
const [,, email, newPassword] = process.argv;
if (!email || !newPassword) {
  console.error('Veuillez fournir un email et un nouveau mot de passe');
  process.exit(1);
}

resetUserPassword(email, newPassword); 