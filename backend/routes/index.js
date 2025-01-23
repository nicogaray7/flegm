const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../services/cache');
const { validateInput } = require('../middleware/security');

// Contrôleurs
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const uploadController = require('../controllers/uploadController');

// Route de test
router.get('/test', (req, res) => {
  res.json({ message: 'API opérationnelle' });
});

// Routes utilisateurs
router.post('/api/users/login', validateInput, userController.login);
router.post('/api/users/register', validateInput, userController.register);
router.get('/api/users/profile', userController.getProfile);
router.put('/api/users/profile', validateInput, userController.updateProfile);

// Routes posts avec cache
router.get('/api/posts', cacheMiddleware(300), postController.getPosts);
router.post('/api/posts', validateInput, postController.createPost);
router.get('/api/posts/:id', cacheMiddleware(300), postController.getPost);
router.put('/api/posts/:id', validateInput, postController.updatePost);
router.delete('/api/posts/:id', postController.deletePost);
router.post('/api/posts/:id/upvote', postController.upvotePost);

// Routes commentaires
router.get('/api/posts/:id/comments', commentController.getComments);
router.post('/api/posts/:id/comments', validateInput, commentController.addComment);
router.delete('/api/comments/:id', commentController.deleteComment);

// Route upload
router.post('/api/upload', uploadController.uploadFile);

module.exports = router; 