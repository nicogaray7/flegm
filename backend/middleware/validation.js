const { check } = require('express-validator');
const CryptoJS = require('crypto-js');

const validateUploadRequest = [
  check('folder').equals('flegm_videos'),
  check('resource_type').equals('video'),
  check('timestamp').isNumeric(),
  check('signature').isString().notEmpty(),
  (req, res, next) => {
    const { timestamp, signature } = req.body;
    const expectedSignature = CryptoJS.HmacSHA256(
      `folder=flegm_videos&resource_type=video&timestamp=${timestamp}`,
      process.env.CLOUDINARY_API_SECRET
    ).toString();

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Signature invalide' });
    }
    next();
  }
];

const validatePost = [
  check('title').trim().isLength({ min: 3, max: 100 }),
  check('description').trim().isLength({ min: 10, max: 1000 }),
  check('videoId').isString().notEmpty()
];

const validateComment = [
  check('content').trim().isLength({ min: 1, max: 500 }),
  check('postId').isMongoId()
];

module.exports = {
  validateUploadRequest,
  validatePost,
  validateComment
}; 