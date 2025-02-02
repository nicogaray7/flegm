require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function resetPassword(email, newPassword) {
  try {
    console.log('Tentative de réinitialisation de mot de passe');
    console.log('Email:', email);
    console.log('Nouveau mot de passe:', newPassword);

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    // Trouver l'utilisateur
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`Aucun utilisateur trouvé avec l'email : ${email}`);
      return;
    }

    console.log('Utilisateur trouvé:', user.username);

    // Générer un nouveau sel et hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    console.log('Sel généré');

    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log('Mot de passe haché');

    // Mettre à jour le mot de passe
    user.password = hashedPassword;
    await user.save();

    console.log(`Mot de passe réinitialisé pour ${email}`);

    // Vérifier le mot de passe
    console.log('Mot de passe stocké:', user.password);
    console.log('Longueur du mot de passe stocké:', user.password.length);
    
    const isMatch = await bcrypt.compare(newPassword, user.password);
    console.log('Vérification du mot de passe:', isMatch);

    // Vérification supplémentaire
    const testMatch = await bcrypt.compare('motdepasse123', user.password);
    console.log('Test avec le mot de passe original:', testMatch);
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe :', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  }
}

// Utilisation : node resetPassword.js email@example.com nouveauMotDePasse
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error('Veuillez fournir un email et un nouveau mot de passe');
  process.exit(1);
}

resetPassword(email, newPassword); 