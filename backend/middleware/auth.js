const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Limite le nombre de requêtes par IP
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 uploads par fenêtre
  message: 'Trop de tentatives d\'upload, veuillez réessayer plus tard'
});

// Validation du token avec vérification supplémentaire
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérification supplémentaire de l'expiration
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp <= currentTimestamp) {
      return res.status(401).json({ message: 'Token expiré' });
    }

    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentification invalide' });
  }
};

module.exports = { authMiddleware, uploadLimiter }; 