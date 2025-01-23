const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  try {
    // Vérification de la connexion MongoDB
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: "Déconnecté",
      1: "Connecté",
      2: "Connexion",
      3: "Déconnexion"
    };

    // Vérification de Cloudinary
    const cloudinaryStatus = await require('cloudinary').v2.api.ping();

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus[dbState],
        connected: dbState === 1
      },
      cloudinary: {
        status: cloudinaryStatus.status === 'ok' ? 'Connecté' : 'Erreur'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router; 