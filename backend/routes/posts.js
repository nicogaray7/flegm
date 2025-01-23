const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { authMiddleware } = require('../middleware/auth');
const { validatePost } = require('../middleware/validation');
const upload = require('../middleware/upload');
const { uploadVideo } = require('../config/cloudinary');
const fs = require('fs');

// Créer un post
router.post('/', 
  authMiddleware,
  upload.single('video'),
  validatePost,
  async (req, res) => {
    try {
      const result = await uploadVideo(req.file.path);
      
      const post = new Post({
        creator: req.user.id,
        title: req.body.title,
        description: req.body.description,
        videoUrl: result.secure_url,
        thumbnailUrl: result.eager[1].secure_url,
        tags: req.body.tags ? JSON.parse(req.body.tags) : []
      });

      await post.save();
      
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(201).json(post);
    } catch (error) {
      console.error('Erreur création post:', error);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ message: 'Erreur serveur' });
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