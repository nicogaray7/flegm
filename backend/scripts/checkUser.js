const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkUserPassword(email, password) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    const user = await User.findOne({ email });

    if (!user) {
      console.error('❌ Utilisateur non trouvé');
      return;
    }

    console.log('🔍 Informations utilisateur:');
    console.log('Email:', user.email);
    console.log('Mot de passe stocké (début):', user.password ? user.password.substring(0, 20) + '...' : 'Pas de mot de passe');

    console.log('\n🧪 Test de comparaison de mot de passe:');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Résultat de la comparaison:', isMatch);

    // Test direct avec bcrypt
    console.log('\n🔐 Vérification directe avec bcrypt:');
    console.log('Mot de passe fourni:', password);
    console.log('Mot de passe haché stocké:', user.password);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Utilisation : node checkUser.js email@example.com motdepasse
const [,, email, password] = process.argv;
if (!email || !password) {
  console.error('Veuillez fournir un email et un mot de passe');
  process.exit(1);
}

checkUserPassword(email, password); 