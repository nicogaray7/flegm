# Guide du Développeur Flegm

## 🏗 Architecture

### Structure du Projet
```
flegm/
├── frontend/              # Application Next.js
│   ├── components/        # Composants React réutilisables
│   ├── pages/            # Pages et routes Next.js
│   ├── styles/           # Styles globaux et utilitaires
│   ├── types/            # Types TypeScript
│   ├── services/         # Services et API clients
│   └── utils/            # Utilitaires et helpers
│
├── backend/              # Serveur Express
│   ├── config/           # Configuration
│   ├── controllers/      # Contrôleurs
│   ├── middleware/       # Middleware personnalisés
│   ├── models/           # Modèles Mongoose
│   ├── routes/           # Routes API
│   └── services/         # Services métier
│
└── docs/                # Documentation
```

## 🔧 Configuration du Développement

### VSCode
Extensions recommandées :
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- MongoDB for VS Code

Settings recommandés (`settings.json`) :
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Git Hooks
Nous utilisons Husky pour les hooks Git :
- Pre-commit : lint et format
- Pre-push : tests

## 📝 Conventions de Code

### JavaScript/TypeScript
- Utiliser ES6+ et TypeScript
- Préférer les fonctions fléchées
- Utiliser async/await plutôt que les promesses directes
- Nommer les fichiers en camelCase

### React
- Composants fonctionnels avec hooks
- Props typées avec TypeScript
- Un composant par fichier
- Styles avec Tailwind CSS

### Tests
- Jest pour les tests unitaires
- React Testing Library pour les tests de composants
- Cypress pour les tests E2E

## 🔄 Workflow Git

### Branches
- `main` : production
- `develop` : développement
- `feature/*` : nouvelles fonctionnalités
- `fix/*` : corrections de bugs
- `release/*` : préparation des releases

### Commits
Format : `type(scope): description`

Types :
- `feat` : nouvelle fonctionnalité
- `fix` : correction de bug
- `docs` : documentation
- `style` : formatage
- `refactor` : refactoring
- `test` : tests
- `chore` : maintenance

### Pull Requests
- Titre descriptif
- Description des changements
- Tests passés
- Code review requise

## 🚀 Déploiement

### Environnements
- `development` : Local
- `staging` : Tests
- `production` : Production

### Variables d'Environnement
Voir `.env.example` pour la liste complète.

### CI/CD
GitHub Actions pour :
- Tests
- Lint
- Build
- Déploiement automatique

## 📦 Gestion des Dépendances

### Frontend
```bash
# Ajouter une dépendance
cd frontend && npm install package-name

# Mettre à jour
npm update
```

### Backend
```bash
# Ajouter une dépendance
cd backend && npm install package-name

# Mettre à jour
npm update
```

## 🐛 Debugging

### Frontend
- Chrome DevTools
- React Developer Tools
- Redux DevTools

### Backend
- Node.js Inspector
- Morgan pour les logs HTTP
- Winston pour les logs applicatifs

## 📊 Monitoring

### Métriques
- New Relic pour les performances
- Sentry pour les erreurs
- Google Analytics pour l'usage

### Logs
- Centralisation avec ELK Stack
- Rotation avec Winston

## 🔐 Sécurité

### Bonnes Pratiques
- Validation des entrées
- Sanitization des données
- Rate limiting
- CORS configuré
- Headers sécurisés

### Authentification
- JWT pour l'API
- Sessions pour OAuth
- Refresh tokens

## 📚 Ressources

### Documentation
- [Next.js](https://nextjs.org/docs)
- [Express](https://expressjs.com/)
- [MongoDB](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Outils
- [Postman Collection](link-to-postman)
- [Swagger API](link-to-swagger)
- [Storybook](link-to-storybook) 