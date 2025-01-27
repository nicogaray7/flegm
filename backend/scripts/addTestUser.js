const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function addTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Utilisateur de test existe déjà');
      return;
    }

    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'motdepasse123'
    });

    await testUser.save();
    console.log('Utilisateur de test créé avec succès');
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
  } finally {
    await mongoose.connection.close();
  }
}

addTestUser(); 