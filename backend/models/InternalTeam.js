const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const internalTeamSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'developer', 'manager', 'support'],
    required: true
  },
  permissions: [{
    type: String
  }],
  avatar: {
    type: String,
    default: function() {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.username}`;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash le mot de passe avant la sauvegarde
internalTeamSchema.pre('save', async function(next) {
  // Ne pas hacher en développement
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
internalTeamSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('InternalTeam', internalTeamSchema); 