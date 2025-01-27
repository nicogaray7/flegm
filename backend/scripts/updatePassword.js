const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function updatePassword() {
  try {
    await mongoose.connect('mongodb+srv://DevCursor:fKKTtQJHKg4b8gG9@flegm.c9ohz.mongodb.net/flegm?retryWrites=true&w=majority&appName=Flegm');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Test123!', salt);
    
    await mongoose.connection.db.collection('users').updateOne(
      { _id: new mongoose.Types.ObjectId('67928a0775f69cefef41ba91') },
      { $set: { password: hashedPassword } }
    );
    
    console.log('Mot de passe mis à jour avec succès');
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await mongoose.connection.close();
  }
}

updatePassword(); 