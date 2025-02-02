const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../services/cache');
const { validateInput } = require('../middleware/security');
const auth = require('../middleware/auth');
const postRoutes = require('./posts');
const userRoutes = require('./users');
const authRoutes = require('./auth');

// Contrôleurs
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const uploadController = require('../controllers/uploadController');

// Middleware pour forcer le Content-Type JSON
router.use((req, res, next) => {
  res.type('application/json');
  next();
});

// Route de test
router.get('/test', (req, res) => {
  res.json({ message: 'API opérationnelle' });
});

// Routes utilisateurs
router.post('/api/users/login', validateInput, userController.login);
router.post('/api/users/register', validateInput, userController.register);
router.get('/api/users/profile', auth, userController.getProfile);
router.put('/api/users/profile', auth, validateInput, userController.updateProfile);

// Routes posts avec cache
router.get('/api/posts', cacheMiddleware(300), postController.getPosts);
router.post('/api/posts', auth, validateInput, postController.createPost);
router.get('/api/posts/:id', cacheMiddleware(300), postController.getPost);
router.put('/api/posts/:id', auth, validateInput, postController.updatePost);
router.delete('/api/posts/:id', auth, postController.deletePost);
router.post('/api/posts/:id/upvote', auth, postController.upvotePost);

// Routes commentaires
router.get('/api/posts/:id/comments', commentController.getComments);
router.post('/api/posts/:id/comments', auth, validateInput, commentController.addComment);
router.delete('/api/comments/:id', auth, commentController.deleteComment);

// Route upload
router.post('/api/upload', auth, uploadController.uploadFile);

router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router; 