const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { authMiddleware } = require('../middleware/auth');
const { validatePost } = require('../middleware/validation');
const upload = require('../middleware/upload');
const { uploadVideo } = require('../config/cloudinary');
const fs = require('fs');
const { google } = require('googleapis');
const { getYoutubeVideoInfo, extractYoutubeId } = require('../controllers/postController');

// Configuration du client YouTube
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

// Fonction pour extraire l'ID YouTube
const extractYoutubeId = (url) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

// Fonction pour récupérer les infos de la vidéo YouTube
const getYoutubeVideoInfo = async (videoId) => {
  try {
    const videoResponse = await youtube.videos.list({
      part: 'snippet',
      id: videoId,
      fields: 'items(snippet(title,thumbnails/high/url,channelId,channelTitle))'
    });

    if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
      throw new Error('Vidéo non trouvée');
    }

    const video = videoResponse.data.items[0];

    // Récupérer les infos de la chaîne
    const channelResponse = await youtube.channels.list({
      part: 'snippet',
      id: video.snippet.channelId,
      fields: 'items(snippet(title,thumbnails/default/url))'
    });

    const channel = channelResponse.data.items[0];

    return {
      title: video.snippet.title,
      thumbnailUrl: video.snippet.thumbnails.high.url,
      youtubeChannel: {
        name: channel.snippet.title,
        avatar: channel.snippet.thumbnails.default.url
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des infos YouTube:', error);
    throw error;
  }
};

// Créer un post YouTube
router.post('/', 
  authMiddleware,
  async (req, res) => {
    try {
      const { videoUrl, tags, isCreator } = req.body;

      // Extraire l'ID YouTube
      const youtubeId = extractYoutubeId(videoUrl);
      if (!youtubeId) {
        return res.status(400).json({ message: 'URL YouTube invalide' });
      }

      // Récupérer les infos de la vidéo
      const videoInfo = await getYoutubeVideoInfo(youtubeId);

      // Créer le post
      const post = new Post({
        youtubeUrl: videoUrl,
        youtubeId: youtubeId,
        creator: req.user._id,
        tags: tags || [],
        title: videoInfo.title,
        thumbnailUrl: videoInfo.thumbnailUrl,
        youtubeChannel: videoInfo.youtubeChannel,
        isCreator: isCreator || false
      });

      await post.save();
      
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
);

// Récupérer tous les posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ upvoteCount: -1, createdAt: -1 })
      .populate('creator', 'username avatar');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Upvote un post
router.post('/:id/upvote', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    const upvoteIndex = post.upvotes.indexOf(req.user.id);
    
    if (upvoteIndex === -1) {
      post.upvotes.push(req.user.id);
      post.upvoteCount += 1;
    } else {
      post.upvotes.splice(upvoteIndex, 1);
      post.upvoteCount -= 1;
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router; 