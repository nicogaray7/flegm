const { check, validationResult } = require('express-validator');
const CryptoJS = require('crypto-js');

// Middleware de validation générique
const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// Validations pour l'upload
const uploadValidations = [
  check('folder').equals('flegm_videos'),
  check('resource_type').equals('video'),
  check('timestamp').isNumeric(),
  check('signature').isString().notEmpty()
];

// Validations pour les posts
const postValidations = [
  check('title').trim().isLength({ min: 3, max: 100 }),
  check('description').trim().isLength({ min: 10, max: 1000 }),
  check('videoId').isString().notEmpty()
];

// Validations pour les commentaires
const commentValidations = [
  check('content').trim().isLength({ min: 1, max: 500 }),
  check('postId').isMongoId()
];

// Middleware de vérification de signature
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
  validate,
  uploadValidations,
  postValidations,
  commentValidations,
  verifySignature
}; 