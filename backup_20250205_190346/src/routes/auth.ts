import express, { Router, Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import logger from '../config/logger';
import { body } from 'express-validator';
import { validate } from '../middleware/requestValidator';

const JWT_SECRET = process.env.JWT_SECRET || 'a24879cf2123968828dcf5a2266fb809a5b7d0ea1713045e62fd07f9a6841494';

const router = express.Router();

// Règles de validation
const registerValidation = [
  body('username').trim().isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  body('email').isEmail().withMessage('L\'adresse email doit être valide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

const loginValidation = [
  body('email').isEmail().withMessage('L\'adresse email doit être valide'),
  body('password').exists().withMessage('Le mot de passe est requis')
];

// Fonction utilitaire pour générer le token JWT
const generateToken = (user: any): string => {
  return jwt.sign(
    { id: user._id.toString() }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );
};

// Routes d'authentification classique
router.post('/register', validate(registerValidation), async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email ou ce nom d\'utilisateur existe déjà' });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({
      username,
      email,
      password
    });

    await newUser.save();

    // Générer un token
    const token = generateToken(newUser);

    res.status(201).json({ 
      message: 'Inscription réussie', 
      token,
      user: { 
        id: newUser._id, 
        username: newUser.username, 
        email: newUser.email 
      } 
    });
  } catch (error) {
    logger.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de l\'inscription' });
  }
});

router.post('/login', validate(loginValidation), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer un token
    const token = generateToken(user);

    res.json({ 
      message: 'Connexion réussie', 
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      } 
    });
  } catch (error) {
    logger.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la connexion' });
  }
});

// Routes d'authentification OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Échec de l\'authentification Google' });
    }
    const token = generateToken(user);
    res.redirect(`https://flegm.fr/oauth-callback?token=${token}`);
  }
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Échec de l\'authentification Facebook' });
    }
    const token = generateToken(user);
    res.redirect(`https://flegm.fr/oauth-callback?token=${token}`);
  }
);

export default router; 