require('dotenv').config({ path: '/Users/Nico/flegm/backend/.env' });
const mongoose = require('mongoose');
const User = require('/Users/Nico/flegm/backend/models/User');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const apiUrl = 'http://localhost:5001/api/posts';

async function submitTestVideo() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    // Trouver l'utilisateur de test
    const user = await User.findOne({ username: 'testuser' });
    if (!user) {
      throw new Error('Utilisateur testuser non trouvé');
    }

    // Générer un token JWT manuellement
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Soumettre la vidéo
    try {
      const response = await axios.post(apiUrl, {
        videoUrl: 'https://www.youtube.com/watch?v=7vheUD_FlK8',
        tags: ['test', 'créateur'],
        isCreator: true
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 secondes de timeout
      });

      console.log('Réponse de la soumission de vidéo :', response.data);
    } catch (axiosError) {
      console.error('Erreur détaillée Axios :', {
        status: axiosError.response ? axiosError.response.status : 'N/A',
        data: axiosError.response ? axiosError.response.data : 'Pas de réponse',
        headers: axiosError.response ? axiosError.response.headers : 'Pas de headers',
        message: axiosError.message,
        config: axiosError.config
      });
    }
  } catch (error) {
    console.error('Erreur lors de la soumission de la vidéo :', error);
  } finally {
    await mongoose.disconnect();
  }
}

submitTestVideo(); 