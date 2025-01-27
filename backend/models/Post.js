const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  youtubeUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/.test(v);
      },
      message: 'URL YouTube invalide'
    }
  },
  youtubeId: {
    type: String,
    required: true
  },
  isCreator: {
    type: Boolean,
    default: false
  },
  youtubeChannel: {
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    }
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  upvoteCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  }
});

// Middleware pour extraire l'ID YouTube avant la sauvegarde
postSchema.pre('save', function(next) {
  if (this.isModified('youtubeUrl')) {
    const match = this.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) {
      this.youtubeId = match[1];
    }
  }
  next();
});

// Index pour le classement
postSchema.index({ upvoteCount: -1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema); 