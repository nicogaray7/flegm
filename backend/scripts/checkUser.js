require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    const user = await User.findOne({ email: 'test@example.com' });
    console.log('Utilisateur :', user);
    
    // Tester différentes méthodes de comparaison
    console.log('Comparaison directe bcrypt:', await bcrypt.compare('motdepasse123', user.password));
    console.log('Comparaison avec méthode du modèle:', await user.comparePassword('motdepasse123'));
    
    // Générer un nouveau hachage et comparer
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('motdepasse123', salt);
    console.log('Nouveau mot de passe haché:', hashedPassword);
    console.log('Comparaison avec le nouveau hachage:', await bcrypt.compare('motdepasse123', hashedPassword));
  } catch (error) {
    console.error('Erreur :', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUser(); 