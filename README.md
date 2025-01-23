# 🎬 Flegm - Plateforme de Découverte de Créateurs

Flegm est une plateforme moderne permettant aux créateurs de contenu de partager leurs créations et aux utilisateurs de découvrir de nouveaux talents. La plateforme met l'accent sur la qualité du contenu et l'interaction communautaire.

## 🌟 Fonctionnalités

- **Découverte de Contenu**
  - Flux personnalisé de contenus
  - Filtrage par popularité et nouveauté
  - Système de tags pour une navigation ciblée

- **Interaction Sociale**
  - Système d'upvotes
  - Commentaires et discussions
  - Profils créateurs personnalisés

- **Gestion de Contenu**
  - Upload de vidéos sécurisé via Cloudinary
  - Support multi-formats
  - Génération automatique de vignettes

- **Authentification**
  - Connexion classique (email/mot de passe)
  - OAuth avec Google, Facebook et TikTok
  - Gestion des rôles (créateur/utilisateur)

## 🛠 Stack Technique

### Frontend
- Next.js / React
- TypeScript
- Tailwind CSS
- React Native Web (compatibilité mobile)

### Backend
- Node.js / Express
- MongoDB / Mongoose
- Redis (cache)
- WebSocket (temps réel)

### Services
- Cloudinary (stockage média)
- MongoDB Atlas (base de données)
- Render (hébergement backend)
- Vercel (hébergement frontend)

## 🚀 Installation

### Prérequis
- Node.js >= 18.0.0
- MongoDB
- npm ou yarn

### Configuration

1. Cloner le repository
```bash
git clone https://github.com/votre-username/flegm.git
cd flegm
```

2. Installer les dépendances
```bash
# Installation des dépendances du projet
npm install

# Installation des dépendances frontend
cd frontend && npm install

# Installation des dépendances backend
cd backend && npm install
```

3. Configurer les variables d'environnement
```bash
# Backend (.env)
cp backend/.env.example backend/.env

# Frontend (.env.local)
cp frontend/.env.example frontend/.env.local
```

4. Remplir les variables d'environnement requises :
- `MONGODB_URI` : URL de connexion MongoDB
- `JWT_SECRET` : Clé secrète pour JWT
- `CLOUDINARY_*` : Credentials Cloudinary
- `OAUTH_*` : Credentials pour l'authentification sociale

### Lancement

**Mode développement**
```bash
# Lancer le backend
npm run backend

# Lancer le frontend
npm run frontend

# Ou lancer les deux simultanément
npm run dev
```

**Mode production**
```bash
# Build du frontend
cd frontend && npm run build

# Build du backend
cd backend && npm run build

# Démarrer en production
npm start
```

## 📱 Applications

### Web (Desktop & Mobile)
- Production : https://flegm.vercel.app
- Développement : http://localhost:3000

### API
- Production : https://api.flegm.fr
- Développement : http://localhost:5000

## 📖 Documentation

- [Documentation API](docs/api.md)
- [Guide du développeur](docs/developer.md)
- [Guide de déploiement](docs/deployment.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez notre [guide de contribution](CONTRIBUTING.md) pour plus d'informations.

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

- [Nom du développeur] - Développeur Full Stack
- [Nom du designer] - UI/UX Designer
- [Nom du PM] - Product Manager

## 📞 Contact

Pour toute question ou suggestion :
- Email : contact@flegm.fr
- Twitter : [@flegm_app](https://twitter.com/flegm_app)
- Discord : [Serveur Flegm](https://discord.gg/flegm) 