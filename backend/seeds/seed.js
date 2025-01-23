require('dotenv').config();
const mongoose = require('mongoose');
const { users, posts, comments } = require('./data');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const seedDatabase = async () => {
  try {
    console.log('\n=== VÉRIFICATION DE LA CONNEXION ===');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connecté à MongoDB');

    // Nettoyage
    console.log('\n=== NETTOYAGE DES COLLECTIONS ===');
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({})
    ]);
    console.log('✓ Collections nettoyées');

    // Création des utilisateurs
    console.log('\n=== CRÉATION DES UTILISATEURS ===');
    const createdUsers = await User.create(users);
    console.log(`✓ ${createdUsers.length} utilisateurs créés`);

    // Création des posts
    console.log('\n=== CRÉATION DES POSTS ===');
    const postsWithCreators = posts.map((post, index) => ({
      ...post,
      creator: createdUsers[index % createdUsers.length]._id
    }));
    const createdPosts = await Post.create(postsWithCreators);
    console.log(`✓ ${createdPosts.length} posts créés`);

    // Création des commentaires
    console.log('\n=== CRÉATION DES COMMENTAIRES ===');
    const commentsWithRefs = comments.map((comment, index) => ({
      ...comment,
      post: createdPosts[index % createdPosts.length]._id,
      user: createdUsers[index % createdUsers.length]._id
    }));
    const createdComments = await Comment.create(commentsWithRefs);
    console.log(`✓ ${createdComments.length} commentaires créés`);

    console.log('\n✅ Seeding terminé avec succès!');
    
    // Affichage des données créées pour vérification
    console.log('\n=== RÉSUMÉ DES DONNÉES ===');
    console.log('Utilisateurs:', await User.find().select('username email'));
    console.log('Posts:', await Post.find().select('title'));
    console.log('Commentaires:', await Comment.find().select('content'));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERREUR:', error);
    process.exit(1);
  }
};

seedDatabase(); 