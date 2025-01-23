const helmet = require('helmet');
const hpp = require('hpp');
const xssClean = require('xss-clean');
const sanitizeHtml = require('sanitize-html');
const rateLimit = require('express-rate-limit');
const { validationResult } = require('express-validator');

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requêtes par IP
});

// Validation des entrées
const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Sanitization du contenu
const sanitizeContent = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [],
          allowedAttributes: {}
        });
      }
    });
  }
  next();
};

// Configuration de sécurité
const securityConfig = [
  helmet(), // Sécurité des en-têtes HTTP
  hpp(), // Protection contre la pollution des paramètres HTTP
  xssClean(), // Protection XSS
  globalLimiter,
  sanitizeContent
];

module.exports = {
  securityConfig,
  validateInput,
  sanitizeContent
}; 