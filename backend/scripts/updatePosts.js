require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const { getYoutubeVideoInfo } = require('../controllers/postController');

async function updatePosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const posts = await Post.find();
    console.log(`${posts.length} posts trouvés`);

    for (const post of posts) {
      try {
        console.log(`\nMise à jour du post ${post._id}...`);
        
        // Récupérer les infos de la vidéo YouTube
        const videoInfo = await getYoutubeVideoInfo(post.youtubeId);
        
        if (videoInfo) {
          // Mettre à jour le post
          Object.assign(post, {
            youtubeChannel: videoInfo.youtubeChannel,
            thumbnailUrl: videoInfo.thumbnailUrl,
            title: videoInfo.title
          });

          await post.save();
          console.log('Post mis à jour avec succès');
        } else {
          console.log('Impossible de récupérer les infos de la vidéo');
        }
      } catch (error) {
        console.error(`Erreur lors de la mise à jour du post ${post._id}:`, error);
      }
    }

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDéconnecté de MongoDB');
    process.exit(0);
  }
}

updatePosts(); 