const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../services/cache');
const { validateInput } = require('../middleware/security');
const auth = require('../middleware/auth');

// Middleware pour forcer le Content-Type JSON
router.use((req, res, next) => {
  res.type('application/json');
  next();
});

// Sous-routes
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/auth', require('./auth'));

// Route de test
router.get('/test', (req, res) => {
  res.json({ message: 'API opérationnelle' });
});

module.exports = router; 