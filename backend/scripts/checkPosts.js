require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/Post');

async function checkPosts() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    // Récupérer tous les posts
    const posts = await Post.find({});
    console.log(`Nombre de posts trouvés : ${posts.length}`);

    // Afficher la structure de chaque post
    posts.forEach((post, index) => {
      console.log(`\nPost ${index + 1}:`);
      console.log(JSON.stringify(post.toObject(), null, 2));
    });

  } catch (error) {
    console.error('Erreur lors de la vérification :', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
    process.exit(0);
  }
}

checkPosts(); 