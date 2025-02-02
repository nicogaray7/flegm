import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

const router = express.Router();

// Fonction utilitaire pour générer le token JWT
const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};

// Routes d'authentification classique
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({
        message: "Un utilisateur existe déjà avec cet email ou ce nom d'utilisateur"
      });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = generateToken(user._id.toString());
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Routes d'authentification sociale
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user as IUser;
    const token = generateToken(user._id.toString());
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user as IUser;
    const token = generateToken(user._id.toString());
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

router.get('/tiktok', passport.authenticate('tiktok'));

router.get(
  '/tiktok/callback',
  passport.authenticate('tiktok', { failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user as IUser;
    const token = generateToken(user._id.toString());
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

export default router;