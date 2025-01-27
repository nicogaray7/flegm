const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const InternalTeam = require('../models/InternalTeam');
const router = express.Router();

// Fonction utilitaire pour générer le token JWT
const generateToken = (userId, userType) => {
  return jwt.sign({ 
    id: userId, 
    userType // 'user' ou 'internal'
  }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    console.log('🔍 Requête de connexion reçue');
    console.log('📋 Corps de la requête:', JSON.stringify(req.body, null, 2));
    console.log('🌐 En-têtes de la requête:', JSON.stringify(req.headers, null, 2));

    const { email, password } = req.body;
    console.log('📧 Email reçu:', email);

    // Chercher dans l'équipe interne
    let user = await InternalTeam.findOne({ email });
    let userType = 'internal';

    // Si pas trouvé dans l'équipe interne, chercher dans les utilisateurs normaux
    if (!user) {
      user = await User.findOne({ email });
      userType = 'user';
    }

    if (!user) {
      console.error('❌ Utilisateur non trouvé:', email);
      return res.status(401).json({ 
        message: 'Email ou mot de passe incorrect',
        details: 'Aucun utilisateur trouvé avec cet email'
      });
    }

    console.log('👤 Utilisateur trouvé:', user.username);
    console.log('🏢 Type de compte:', userType);

    const isValidPassword = await user.comparePassword(password);
    console.log('🔑 Résultat de la vérification du mot de passe:', isValidPassword);
    console.log('🕵️ Détails de débogage du mot de passe:', {
      inputPassword: password,
      inputPasswordLength: password.length,
      storedPasswordHash: user.password ? user.password.substring(0, 20) + '...' : 'Pas de mot de passe stocké',
      userEmail: user.email,
      userId: user._id
    });

    if (!isValidPassword) {
      console.error('❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({ 
        message: 'Email ou mot de passe incorrect',
        details: 'Le mot de passe ne correspond pas'
      });
    }

    const token = generateToken(user._id, userType);
    console.log('✅ Connexion réussie pour:', email);
    
    res.json({ 
      token, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: userType === 'internal' ? user.role : undefined,
        permissions: userType === 'internal' ? user.permissions : undefined,
        userType // Ajouter le type d'utilisateur
      }
    });
  } catch (error) {
    console.error('🚨 Erreur lors de la connexion:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la connexion',
      details: error.message 
    });
  }
});

// Route de vérification du profil
router.get('/users/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token non fourni' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.userType === 'internal') {
      user = await InternalTeam.findById(decoded.id).select('-password');
    } else {
      user = await User.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
      ...user.toObject(),
      userType: decoded.userType
    });
  } catch (error) {
    console.error('Erreur de vérification du profil:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
});

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({
        message: 'Un utilisateur existe déjà avec cet email ou ce nom d\'utilisateur',
      });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    const token = generateToken(user._id, 'user');
    res.status(201).json({ token });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
});

module.exports = router; 