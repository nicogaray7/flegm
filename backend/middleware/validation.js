const { check, validationResult } = require('express-validator');
const CryptoJS = require('crypto-js');

// Validation des entrées
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Règles de validation
const postRules = [
  check('title').trim().isLength({ min: 3, max: 100 }),
  check('description').trim().isLength({ min: 10, max: 1000 })
];

const commentRules = [
  check('content').trim().isLength({ min: 1, max: 500 }),
  check('postId').isMongoId()
];

const uploadRules = [
  check('folder').equals('flegm_videos'),
  check('resource_type').equals('video'),
  check('timestamp').isNumeric(),
  check('signature').isString().notEmpty()
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
  validateRequest,
  postRules,
  commentRules,
  uploadRules,
  verifySignature
}; 