const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const InternalTeam = require('../models/InternalTeam');

// Limite le nombre de requêtes par IP
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 uploads par fenêtre
  message: 'Trop de tentatives d\'upload, veuillez réessayer plus tard'
});

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token non fourni' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.userType === 'internal') {
      user = await InternalTeam.findById(decoded.id);
    } else {
      user = await User.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non autorisé' });
    }

    if (user.isDeactivated) {
      return res.status(403).json({ 
        message: 'Compte désactivé', 
        details: 'Votre compte a été désactivé. Veuillez contacter le support.' 
      });
    }

    // Ajouter l'utilisateur et son type à la requête
    req.user = {
      ...user.toObject(),
      userType: decoded.userType
    };

    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }

    res.status(500).json({ error: 'Erreur d\'authentification' });
  }
};

module.exports = authMiddleware; 