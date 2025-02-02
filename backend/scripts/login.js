const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Charger manuellement les variables d'environnement
const envPath = path.resolve(__dirname, '../.env');
const envContents = fs.readFileSync(envPath, 'utf-8');
envContents.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    process.env[key.trim()] = value.trim().replace(/^"|"$/g, '');
  }
});

console.log('Variables d\'environnement :', process.env);

async function testLogin(email, password) {
  try {
    const mongoURI = `${process.env.MONGODB_URI}=true&w=majority`;
    console.log('URI de connexion:', mongoURI);
    
    // Connexion à MongoDB
    await mongoose.connect(mongoURI);
    console.log('Connecté à MongoDB');

    // Trouver l'utilisateur
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`Aucun utilisateur trouvé avec l'email : ${email}`);
      return false;
    }

    console.log('Utilisateur trouvé:', user.username);
    console.log('Mot de passe stocké:', user.password);
    console.log('Mot de passe fourni:', password);

    // Utiliser la méthode comparePassword du modèle
    const isMatch = await user.comparePassword(password);
    console.log('Vérification du mot de passe:', isMatch);

    return isMatch;
  } catch (error) {
    console.error('Erreur lors de la tentative de connexion :', error);
    return false;
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  }
}

// Utilisation : node login.js email@example.com motdepasse
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Veuillez fournir un email et un mot de passe');
  process.exit(1);
}

testLogin(email, password)
  .then(result => {
    process.exit(result ? 0 : 1);
  })
  .catch(() => {
    process.exit(1);
  }); 