const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  try {
    // Vérification de la connexion MongoDB
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB non connecté');
    }

    res.json({
      status: 'healthy',
      mongodb: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

module.exports = router; 