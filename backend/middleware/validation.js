const { check, validationResult } = require('express-validator');
const CryptoJS = require('crypto-js');

// Middleware de validation
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation des posts
const validatePost = [
  check('title').trim().isLength({ min: 3, max: 100 })
    .withMessage('Le titre doit contenir entre 3 et 100 caractères'),
  check('description').trim().isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères'),
  validateRequest
];

// Validation des uploads
const validateUpload = [
  check('timestamp').isNumeric()
    .withMessage('Timestamp invalide'),
  check('signature').isString().notEmpty()
    .withMessage('Signature requise'),
  validateRequest
];

// Validation des commentaires
const validateComment = [
  check('content').trim().isLength({ min: 1, max: 500 })
    .withMessage('Le commentaire doit contenir entre 1 et 500 caractères'),
  check('postId').isMongoId()
    .withMessage('ID de post invalide'),
  validateRequest
];

// Vérification de signature
const verifySignature = (req, res, next) => {
  const { timestamp, signature } = req.body;
  const expectedSignature = CryptoJS.HmacSHA256(
    `folder=flegm_videos&resource_type=video&timestamp=${timestamp}`,
    process.env.CLOUDINARY_API_SECRET
  ).toString();

  if (signature !== expectedSignature) {
    return res.status(400).json({ message: 'Signature invalide' });
  }
  next();
};

module.exports = {
  validatePost,
  validateUpload,
  validateComment,
  verifySignature
}; 