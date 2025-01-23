const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../services/cache');
const { validateInput } = require('../middleware/security');

// Contrôleurs
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const uploadController = require('../controllers/uploadController');

// Routes utilisateurs
router.post('/users/login', validateInput, userController.login);
router.post('/users/register', validateInput, userController.register);
router.get('/users/profile', userController.getProfile);
router.put('/users/profile', validateInput, userController.updateProfile);

// Routes posts avec cache
router.get('/posts', cacheMiddleware(300), postController.getPosts);
router.post('/posts', validateInput, postController.createPost);
router.get('/posts/:id', cacheMiddleware(300), postController.getPost);
router.put('/posts/:id', validateInput, postController.updatePost);
router.delete('/posts/:id', postController.deletePost);
router.post('/posts/:id/upvote', postController.upvotePost);

// Routes commentaires
router.get('/posts/:id/comments', commentController.getComments);
router.post('/posts/:id/comments', validateInput, commentController.addComment);
router.delete('/comments/:id', commentController.deleteComment);

// Route upload
router.post('/upload', uploadController.uploadFile);

module.exports = router; 