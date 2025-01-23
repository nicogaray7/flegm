const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { authMiddleware, uploadLimiter } = require('../middleware/auth');
const { validateUploadRequest } = require('../middleware/validation');

// Middleware de validation des requêtes
const validateUploadRequest = (req, res, next) => {
  const { folder, resource_type } = req.query;
  
  // Validation du dossier
  if (folder !== 'flegm_videos') {
    return res.status(400).json({ message: 'Dossier non autorisé' });
  }

  // Validation du type de ressource
  if (resource_type !== 'video') {
    return res.status(400).json({ message: 'Type de ressource non autorisé' });
  }

  next();
};

router.get('/signature', 
  authMiddleware, 
  uploadLimiter,
  validateUploadRequest,
  async (req, res) => {
    try {
      const timestamp = Math.round((new Date).getTime()/1000);
      
      // Paramètres de sécurité supplémentaires
      const uploadParams = {
        timestamp,
        folder: 'flegm_videos',
        resource_type: 'video',
        access_mode: 'authenticated',
        max_file_size: 100000000, // 100MB
        allowed_formats: ['mp4', 'mov'],
        moderation: 'aws_rek' // Modération automatique du contenu
      };

      const signature = cloudinary.utils.api_sign_request(
        uploadParams,
        process.env.CLOUDINARY_API_SECRET
      );

      res.json({
        ...uploadParams,
        signature,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME
      });
    } catch (error) {
      console.error('Erreur signature:', error);
      res.status(500).json({ message: 'Erreur de signature' });
    }
  }
);

module.exports = router; 