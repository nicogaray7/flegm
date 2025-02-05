import express, { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import bcrypt from 'bcryptjs';

// Interface personnalisée pour la requête avec utilisateur
interface CustomRequest extends Request {
  user?: any;
}

const router = express.Router();

// Fonction utilitaire pour générer le token JWT
const generateToken = (user: any): string => {
  const token = jwt.sign(
    { id: user._id.toString() }, 
    process.env.JWT_SECRET || '', 
    { expiresIn: '7d' }
  );
  return token;
};

// Routes d'authentification classique
router.post('/register', async (req: Request, res: Response) => {
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
      message: 'Utilisateur enregistré avec succès', 
      token,
      user: { 
        id: newUser._id, 
        username: newUser.username, 
        email: newUser.email 
      } 
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
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
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
});

// Routes d'authentification Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: CustomRequest, res: Response) => {
    // Rediriger ou renvoyer un token
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Authentification échouée' });
    }
    const token = generateToken(user);
    res.redirect(`https://flegm.fr/oauth-callback?token=${token}`);
  }
);

// Routes d'authentification Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req: CustomRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Authentification échouée' });
    }
    const token = generateToken(user);
    res.redirect(`https://flegm.fr/oauth-callback?token=${token}`);
  }
);

// Routes d'authentification TikTok
router.get('/tiktok', passport.authenticate('tiktok', { scope: ['user.info.basic'] }));

router.get(
  '/tiktok/callback',
  passport.authenticate('tiktok', { failureRedirect: '/login' }),
  (req: CustomRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Authentification échouée' });
    }
    const token = generateToken(user);
    res.redirect(`https://flegm.fr/oauth-callback?token=${token}`);
  }
);

export default router; 