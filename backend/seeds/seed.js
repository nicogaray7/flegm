require('dotenv').config();
const mongoose = require('mongoose');
const { users, posts, comments } = require('./data');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const seedDatabase = async () => {
  try {
    console.log('Début du seeding...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connecté à MongoDB');

    console.log('Nettoyage de la base...');
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({})
    ]);
    console.log('Base de données nettoyée');

    console.log('Création des utilisateurs...');
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} utilisateurs créés`);

    // Création des posts avec upvotes aléatoires
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
    console.log(`${createdPosts.length} posts créés`);

    // Création des commentaires
    const commentsWithRefs = comments.map((comment, index) => ({
      ...comment,
      post: createdPosts[index % createdPosts.length]._id,
      user: createdUsers[index % createdUsers.length]._id
    }));

    await Comment.insertMany(commentsWithRefs);
    console.log(`${commentsWithRefs.length} commentaires créés`);

    console.log('Seeding terminé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding:', error);
    process.exit(1);
  }
};

seedDatabase(); 