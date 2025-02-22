import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  googleId?: string;
  facebookId?: string;
  tiktokId?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false, // Optionnel pour l'authentification sociale
    minlength: 6,
  },
  avatar: {
    type: String,
    default: '',
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  facebookId: {
    type: String,
    sparse: true,
    unique: true,
  },
  tiktokId: {
    type: String,
    sparse: true,
    unique: true,
  },
}, {
  timestamps: true,
});

// Hash le mot de passe avant la sauvegarde
userSchema.pre('save', async function(next) {
  // Ne hash le mot de passe que s'il a été modifié
  if (this.isModified('password') && this.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error as mongoose.CallbackError);
    }
  } else {
    next();
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema); 