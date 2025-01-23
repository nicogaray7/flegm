require('dotenv').config();
const mongoose = require('mongoose');
const { users, posts, comments } = require('./data');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const seedDatabase = async () => {
  try {
    // 1. Vérification de l'environnement
    console.log('\n=== VÉRIFICATION DE L\'ENVIRONNEMENT ===');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? '✓ Définie' : '✗ Non définie');
    console.log('Node version:', process.version);

    // 2. Connexion à MongoDB
    console.log('\n=== CONNEXION À MONGODB ===');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Connecté avec succès à MongoDB');

    // 3. Nettoyage des collections existantes
    console.log('\n=== NETTOYAGE DE LA BASE DE DONNÉES ===');
    const deleteResults = await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({})
    ]);
    console.log('✓ Collection Users nettoyée:', deleteResults[0].deletedCount, 'documents supprimés');
    console.log('✓ Collection Posts nettoyée:', deleteResults[1].deletedCount, 'documents supprimés');
    console.log('✓ Collection Comments nettoyée:', deleteResults[2].deletedCount, 'documents supprimés');

    // 4. Création des utilisateurs
    console.log('\n=== CRÉATION DES UTILISATEURS ===');
    console.log('Tentative de création de', users.length, 'utilisateurs...');
    const createdUsers = await User.insertMany(users);
    console.log('✓', createdUsers.length, 'utilisateurs créés avec succès');
    createdUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.email}) - ${user.isCreator ? 'Créateur' : 'Viewer'}`);
    });

    // 5. Création des posts
    console.log('\n=== CRÉATION DES POSTS ===');
    console.log('Préparation de', posts.length, 'posts...');
    const postsWithRefs = posts.map((post, index) => {
      const randomUpvoters = createdUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, post.upvoteCount)
        .map(user => user._id);

      return {
        ...post,
        creator: createdUsers[index % 2]._id,
        upvotes: randomUpvoters,
        upvoteCount: randomUpvoters.length
      };
    });

    const createdPosts = await Post.insertMany(postsWithRefs);
    console.log('✓', createdPosts.length, 'posts créés avec succès');
    createdPosts.forEach(post => {
      console.log(`  - "${post.title}" par ${post.creator} - ${post.upvoteCount} upvotes`);
    });

    // 6. Création des commentaires
    console.log('\n=== CRÉATION DES COMMENTAIRES ===');
    console.log('Préparation de', comments.length, 'commentaires...');
    const commentsWithRefs = comments.map((comment, index) => ({
      ...comment,
      post: createdPosts[index % createdPosts.length]._id,
      user: createdUsers[index % createdUsers.length]._id
    }));

    const createdComments = await Comment.insertMany(commentsWithRefs);
    console.log('✓', createdComments.length, 'commentaires créés avec succès');
    createdComments.forEach(comment => {
      console.log(`  - "${comment.content.substring(0, 30)}..." sur le post ${comment.post}`);
    });

    // 7. Résumé final
    console.log('\n=== RÉSUMÉ DU SEEDING ===');
    console.log('✓ Utilisateurs créés:', createdUsers.length);
    console.log('✓ Posts créés:', createdPosts.length);
    console.log('✓ Commentaires créés:', createdComments.length);
    console.log('\n✅ Seeding terminé avec succès !\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERREUR LORS DU SEEDING ❌');
    console.error('Nature de l\'erreur:', error.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

// Lancement du seeding
console.log('\n🚀 DÉMARRAGE DU PROCESSUS DE SEEDING...\n');
seedDatabase(); 