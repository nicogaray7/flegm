const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Middleware pour forcer le Content-Type JSON
router.use((req, res, next) => {
  res.type('application/json');
  next();
});

router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 