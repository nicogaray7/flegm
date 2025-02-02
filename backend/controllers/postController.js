const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { cache } = require('../services/cache');
const { google } = require('googleapis');
const mongoose = require('mongoose');

// Vérification de la clé API
console.log('Vérification de la clé API YouTube:', process.env.YOUTUBE_API_KEY ? 'Définie' : 'Non définie');

// Configuration du client YouTube avec la clé API
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

// Fonction pour extraire l'ID YouTube d'une URL
const extractYoutubeId = (url) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

// Fonction pour récupérer les infos de la vidéo YouTube
const getYoutubeVideoInfo = async (videoId) => {
  try {
    console.log('Tentative de récupération des infos pour la vidéo:', videoId);
    console.log('Utilisation de la clé API:', process.env.YOUTUBE_API_KEY);

    const response = await youtube.videos.list({
      part: 'snippet,statistics',
      id: videoId,
      fields: 'items(id,snippet(title,thumbnails/high/url,publishedAt,channelTitle,channelId))'
    });

    console.log('Réponse de l\'API YouTube:', JSON.stringify(response.data, null, 2));
    
    if (!response.data.items || response.data.items.length === 0) {
      console.error('Aucune vidéo trouvée pour l\'ID:', videoId);
      throw new Error('Vidéo YouTube non trouvée');
    }

    const video = response.data.items[0];

    // Récupérer les informations de la chaîne
    const channelResponse = await youtube.channels.list({
      part: 'snippet',
      id: video.snippet.channelId,
      fields: 'items(snippet(title,thumbnails/default/url))'
    });

    const channel = channelResponse.data.items[0];

    const videoInfo = {
      title: video.snippet.title,
      thumbnailUrl: video.snippet.thumbnails.high.url,
      youtubeChannel: {
        name: channel.snippet.title,
        avatar: channel.snippet.thumbnails.default.url
      }
    };

    console.log('Informations extraites de la vidéo:', JSON.stringify(videoInfo, null, 2));
    return videoInfo;

  } catch (error) {
    console.error('Erreur détaillée getYoutubeVideoInfo:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      config: error.config
    });
    throw new Error(`Erreur API YouTube: ${error.message}`);
  }
};

exports.getPosts = async (req, res) => {
  try {
    console.log('Récupération des posts...');
    
    // Vérifier si la connexion MongoDB est établie
    if (mongoose.connection.readyState !== 1) {
      console.warn('Connexion MongoDB non établie. Tentative de reconnexion...');
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000
      });
    }

    // Vérifier si les posts sont en cache
    const cachedPosts = await cache.get('posts');
    if (cachedPosts) {
      console.log('Retour des posts depuis le cache');
      return res.json(cachedPosts);
    }

    // Récupérer les posts depuis la base de données
    const posts = await Post.find()
      .populate('creator', 'username avatar')
      .sort({ createdAt: -1 })
      .lean()
      .limit(20);

    if (!Array.isArray(posts)) {
      console.error('Les posts ne sont pas un tableau:', posts);
      return res.status(500).json({ message: 'Erreur de récupération des posts' });
    }

    console.log(`${posts.length} posts trouvés`);

    // Traiter chaque post individuellement
    const postsWithComments = await Promise.all(posts.map(async (post) => {
      try {
        console.log('Traitement du post:', post._id);
        const commentCount = await Comment.countDocuments({ post: post._id });
        
        // S'assurer que toutes les propriétés requises sont présentes
        const processedPost = {
          _id: post._id,
          title: post.title || 'Titre non disponible',
          youtubeUrl: post.youtubeUrl || '',
          youtubeId: post.youtubeId || '',
          thumbnailUrl: post.thumbnailUrl || `https://img.youtube.com/vi/${post.youtubeId}/mqdefault.jpg`,
          creator: post.creator || { username: 'Utilisateur inconnu', avatar: '/default-avatar.png' },
          tags: post.tags || [],
          upvotes: post.upvotes || [],
          upvoteCount: post.upvoteCount || 0,
          createdAt: post.createdAt,
          isCreator: post.isCreator || false,
          youtubeChannel: post.youtubeChannel || { name: 'Chaîne inconnue' },
          commentCount
        };
        
        return processedPost;
      } catch (error) {
        console.error('Erreur lors du traitement du post:', post._id, error);
        // Continuer avec le post suivant
        return null;
      }
    }));

    // Mettre en cache pour les prochaines requêtes
    await cache.set('posts', postsWithComments, 300);

    console.log('Envoi des posts traités');
    res.json(postsWithComments);
  } catch (error) {
    console.error('Erreur getPosts:', {
      message: error.message,
      stack: error.stack,
      connectionState: mongoose.connection.readyState
    });
    
    // Gestion des erreurs de connexion MongoDB
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return res.status(503).json({ 
        message: 'Service temporairement indisponible. Veuillez réessayer plus tard.',
        error: 'Problème de connexion à la base de données'
      });
    }

    res.status(500).json({ 
      message: 'Erreur lors de la récupération des posts',
      error: error.message 
    });
  }
};

exports.createPost = async (req, res) => {
  try {
    console.log('Création d\'un post par:', req.user.username);
    console.log('Données reçues:', req.body);

    const youtubeId = extractYoutubeId(req.body.videoUrl);
    if (!youtubeId) {
      console.error('URL YouTube invalide:', req.body.videoUrl);
      return res.status(400).json({ message: 'URL YouTube invalide' });
    }

    console.log('ID YouTube extrait:', youtubeId);

    const videoInfo = await getYoutubeVideoInfo(youtubeId);
    console.log('Informations de la vidéo récupérées:', videoInfo);

    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      console.error('Identifiant de créateur invalide:', req.user._id);
      return res.status(400).json({ message: 'Identifiant de créateur invalide' });
    }

    const post = new Post({
      youtubeUrl: req.body.videoUrl,
      youtubeId: youtubeId,
      creator: req.user._id,
      tags: req.body.tags || [],
      title: videoInfo.title,
      thumbnailUrl: videoInfo.thumbnailUrl,
      youtubeChannel: videoInfo.youtubeChannel,
      isCreator: req.body.isCreator || false
    });

    await post.save();
    console.log('Post créé avec succès:', post);

    // Invalider le cache
    cache.del('posts');
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Erreur complète createPost:', {
      message: error.message,
      stack: error.stack,
      originalError: error
    });
    res.status(400).json({ message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('creator', 'username')
      .populate('comments.author', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, creator: req.user._id },
      req.body,
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    cache.del(`post_${req.params.id}`);
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      creator: req.user._id
    });
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    cache.del(`post_${req.params.id}`);
    cache.del('posts');
    res.json({ message: 'Post supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.upvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    
    const upvoteIndex = post.upvotes.indexOf(req.user._id);
    if (upvoteIndex === -1) {
      post.upvotes.push(req.user._id);
      post.upvoteCount += 1;
    } else {
      post.upvotes.splice(upvoteIndex, 1);
      post.upvoteCount -= 1;
    }
    
    await post.save();
    cache.del(`post_${req.params.id}`);
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 