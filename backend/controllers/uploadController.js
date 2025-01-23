const { uploadVideo } = require('../config/cloudinary');
const fs = require('fs');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const result = await uploadVideo(req.file.path);
    
    // Nettoyage du fichier temporaire
    fs.unlinkSync(req.file.path);

    res.json({
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Erreur lors de l\'upload' });
  }
}; 