require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const { google } = require('googleapis');

// Configuration du client YouTube avec la clé API
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

async function getYoutubeVideoInfo(videoId) {
  try {
    // Récupérer les infos de la vidéo pour obtenir l'ID de la chaîne
    const videoResponse = await youtube.videos.list({
      part: 'snippet',
      id: videoId,
      fields: 'items(snippet(channelId,channelTitle,thumbnails/high/url))'
    });

    if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
      throw new Error('Vidéo non trouvée');
    }

    const videoSnippet = videoResponse.data.items[0].snippet;
    const channelId = videoSnippet.channelId;
    const thumbnailUrl = videoSnippet.thumbnails.high.url;

    // Récupérer les infos de la chaîne
    const channelResponse = await youtube.channels.list({
      part: 'snippet',
      id: channelId,
      fields: 'items(snippet(title,thumbnails/default/url))'
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      throw new Error('Chaîne non trouvée');
    }

    const channel = channelResponse.data.items[0];
    return {
      channel: {
        name: channel.snippet.title,
        avatar: channel.snippet.thumbnails.default.url
      },
      thumbnailUrl: thumbnailUrl,
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des infos YouTube:', error);
    return null;
  }
}

async function updatePosts() {
  try {
    console.log('Connexion à MongoDB...');
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
          // Créer un nouvel objet avec les champs existants
          const updatedPost = {
            ...post.toObject(),
            youtubeChannel: videoInfo.channel,
            thumbnailUrl: videoInfo.thumbnailUrl,
            youtubeUrl: videoInfo.youtubeUrl,
            youtubeStats: undefined // Supprimer youtubeStats
          };

          // Mettre à jour le post avec tous les champs
          Object.assign(post, updatedPost);
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