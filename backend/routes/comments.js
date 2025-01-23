const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

router.post('/:postId', auth, async (req, res) => {
  try {
    const comment = new Comment({
      post: req.params.postId,
      user: req.user.id,
      content: req.body.content
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router; 