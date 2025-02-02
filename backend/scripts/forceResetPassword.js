require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function forceResetPassword(email, newPassword) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`Aucun utilisateur trouvé avec l'email : ${email}`);
      return false;
    }

    // Forcer la modification du mot de passe
    user.password = newPassword;
    await user.save();

    console.log(`Mot de passe réinitialisé pour ${email}`);
    
    // Vérifier le nouveau mot de passe
    const updatedUser = await User.findOne({ email });
    const isMatch = await bcrypt.compare(newPassword, updatedUser.password);
    console.log('Vérification du nouveau mot de passe :', isMatch);

    return isMatch;
  } catch (error) {
    console.error('Erreur :', error);
    return false;
  } finally {
    await mongoose.disconnect();
  }
}

// Utilisation : node forceResetPassword.js email@example.com nouveauMotDePasse
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error('Veuillez fournir un email et un nouveau mot de passe');
  process.exit(1);
}

forceResetPassword(email, newPassword)
  .then(result => {
    process.exit(result ? 0 : 1);
  })
  .catch(() => {
    process.exit(1);
  }); 