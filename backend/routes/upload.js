const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { authMiddleware, uploadLimiter } = require('../middleware/auth');
const { validateUpload } = require('../middleware/validation');

// Route pour obtenir la signature
router.get('/signature', 
  authMiddleware,
  uploadLimiter,
  validateUpload,
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
        moderation: 'aws_rek'
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