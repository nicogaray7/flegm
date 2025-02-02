const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../services/cache');
const { validateInput } = require('../middleware/security');
const auth = require('../middleware/auth');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

// Middleware pour forcer le Content-Type JSON
router.use((req, res, next) => {
  res.type('application/json');
  next();
});

// Routes posts avec cache
router.get('/', cacheMiddleware(300), postController.getPosts);
router.post('/', auth, validateInput, postController.createPost);
router.get('/:id', cacheMiddleware(300), postController.getPost);
router.put('/:id', auth, validateInput, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);
router.post('/:id/upvote', auth, postController.upvotePost);

// Routes commentaires
router.get('/:id/comments', commentController.getComments);
router.post('/:id/comments', auth, validateInput, commentController.addComment);
router.delete('/:postId/comments/:id', auth, commentController.deleteComment);

module.exports = router; 