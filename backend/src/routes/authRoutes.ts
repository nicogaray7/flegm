import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { validateEmail, validatePassword } from '../utils/validation';

const router = express.Router();

// Configuration des secrets
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_EXPIRATION = '7d';

// Middleware de validation de token
const authenticateToken = (req: any, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation des données
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Email invalide' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: 'Mot de passe invalide', 
        requirements: 'Au moins 8 caractères, une majuscule, un chiffre' 
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Création de l'utilisateur
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user' // Rôle par défaut
    });

    await newUser.save();

    // Génération du token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRATION }
    );

    res.status(201).json({ 
      token, 
      user: { 
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role 
      } 
    });
  } catch (error) {
    console.error('Erreur d\'inscription :', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Générer un token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRATION }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Erreur de connexion :', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Route de validation de token
router.post('/validate', authenticateToken, (req: any, res) => {
  res.json({ 
    valid: true, 
    user: { 
      id: req.user.id, 
      email: req.user.email, 
      role: req.user.role 
    } 
  });
});

// Route de mise à jour du profil (protégée)
router.put('/profile', authenticateToken, async (req: any, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId, 
      { name }, 
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Erreur de mise à jour du profil :', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

export default router; 