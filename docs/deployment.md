# Guide de Déploiement Flegm

## 🌍 Environnements

### Production
- Frontend : Vercel (flegm.vercel.app)
- Backend : Render (api.flegm.fr)
- Base de données : MongoDB Atlas
- Média : Cloudinary
- Cache : Redis Labs

### Staging
- Frontend : staging.flegm.vercel.app
- Backend : staging.api.flegm.fr
- Base de données : MongoDB Atlas (cluster staging)

## 🚀 Déploiement Frontend

### Configuration Vercel

1. Connexion au dashboard Vercel
```bash
vercel login
```

2. Configuration du projet
```bash
# À la racine du projet frontend
vercel
```

3. Variables d'environnement requises :
```
NEXT_PUBLIC_API_URL=https://api.flegm.fr
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dfupyozxe
NEXT_PUBLIC_CLOUDINARY_API_KEY=xxx
NODE_ENV=production
```

4. Déploiement manuel
```bash
# Déploiement en production
vercel --prod

# Déploiement en staging
vercel
```

### Optimisations
- Compression des assets
- Cache-Control headers
- Preloading des routes principales
- Optimisation des images

## 🖥 Déploiement Backend

### Configuration Render

1. Créer une nouvelle application Web
2. Connecter le repository GitHub
3. Configurer les variables d'environnement

Variables requises :
```
NODE_ENV=production
PORT=8080
MONGODB_URI=xxx
JWT_SECRET=xxx
CLOUDINARY_CLOUD_NAME=dfupyozxe
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
FRONTEND_URL=https://flegm.vercel.app
```

4. Configuration du build
```yaml
services:
  - type: web
    name: flegm-api
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    healthCheckPath: /api/health
```

### Scaling
- Auto-scaling basé sur la charge
- Minimum 1 instance
- Maximum 10 instances

## 📊 Base de Données

### MongoDB Atlas

1. Création du cluster
2. Configuration du réseau
   - IP whitelist
   - Authentification utilisateur
3. Indexation
   - Posts (upvoteCount, createdAt)
   - Users (email, username)
4. Backup
   - Snapshots quotidiens
   - Rétention 7 jours

### Migration
```bash
# Backup
mongodump --uri="mongodb+srv://..."

# Restore
mongorestore --uri="mongodb+srv://..."
```

## 🗄️ Cache Redis

### Configuration Redis Labs

1. Création de l'instance
2. Configuration de la connexion SSL
3. Définition des politiques d'éviction
4. Monitoring de la mémoire

### Paramètres recommandés
```
maxmemory 2gb
maxmemory-policy allkeys-lru
timeout 3600
```

## 📸 Cloudinary

### Configuration

1. Création du compte
2. Configuration des transformations
3. Définition des upload presets
4. Configuration des restrictions de sécurité

### Transformations automatiques
```javascript
// Vignettes
w_300,h_300,c_fill,q_auto

// Vidéos
w_720,h_480,c_fill,q_auto:good
```

## 🔒 SSL/TLS

### Certificats
- Gestion automatique par Vercel/Render
- Renouvellement automatique
- Force HTTPS

### Headers de Sécurité
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
```

## 📊 Monitoring

### New Relic
- APM pour le backend
- Browser monitoring pour le frontend
- Alertes personnalisées

### Sentry
- Tracking des erreurs frontend
- Tracking des erreurs backend
- Release tracking

### Logs
- Centralisation avec ELK Stack
- Rétention 30 jours
- Alertes sur patterns

## 🚨 Rollback

### Frontend
```bash
# Retour à la version précédente
vercel rollback
```

### Backend
```bash
# Via Render dashboard
render rollback
```

### Base de données
```bash
# Restauration du snapshot
mongorestore --uri="mongodb+srv://..." --drop
```

## 📋 Checklist de Déploiement

1. Tests
   - [ ] Tests unitaires
   - [ ] Tests d'intégration
   - [ ] Tests E2E

2. Build
   - [ ] Build frontend réussi
   - [ ] Build backend réussi
   - [ ] Migrations DB appliquées

3. Déploiement
   - [ ] Variables d'environnement vérifiées
   - [ ] SSL/TLS actif
   - [ ] DNS configuré

4. Vérification
   - [ ] Health check OK
   - [ ] Monitoring actif
   - [ ] Logs accessibles 