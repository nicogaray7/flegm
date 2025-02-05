# Guide de Déploiement et Maintenance

## Prérequis

- Compte Render.com
- Compte MongoDB Atlas
- Compte Sentry.io
- Compte Cloudinary

## Variables d'Environnement

Toutes les variables d'environnement sensibles doivent être configurées dans Render.com :

- `NODE_ENV`: production
- `PORT`: 8080
- `MONGODB_URI`: URI de connexion MongoDB
- `JWT_SECRET`: Clé secrète pour JWT
- `CLOUDINARY_CLOUD_NAME`: Nom du cloud Cloudinary
- `CLOUDINARY_API_KEY`: Clé API Cloudinary
- `CLOUDINARY_API_SECRET`: Secret API Cloudinary
- `SENTRY_DSN`: URL DSN Sentry
- `SESSION_SECRET`: Clé secrète pour les sessions
- `FRONTEND_URL`: URL du frontend

## Procédure de Déploiement

1. **Préparation**
   ```bash
   # Vérifier les tests
   npm run test
   
   # Build local
   npm run build
   ```

2. **Déploiement**
   - Le déploiement est automatique sur la branche main
   - Render.com déclenche automatiquement un build

3. **Vérification Post-Déploiement**
   - Vérifier le statut sur Render.com
   - Vérifier les logs dans Sentry
   - Tester les endpoints critiques
   - Vérifier les métriques de performance

## Monitoring

### Sentry
- Dashboard: https://sentry.io/organizations/your-org/
- Métriques surveillées:
  - Erreurs serveur
  - Performance des requêtes
  - Profiling des fonctions

### Logs
- Accessibles via le dashboard Render
- Rétention: 7 jours
- Niveau de log: info en production

## Procédure de Backup

### MongoDB Atlas
- Backups automatiques quotidiens
- Rétention: 7 jours
- Procédure de restauration:
  1. Se connecter à MongoDB Atlas
  2. Sélectionner le backup point
  3. Restaurer vers un nouveau cluster si nécessaire

## Plan de Reprise après Sinistre (DRP)

### Scénario 1: Panne de Base de Données
1. Vérifier les logs MongoDB Atlas
2. Restaurer le dernier backup valide
3. Vérifier l'intégrité des données
4. Redémarrer l'application si nécessaire

### Scénario 2: Problèmes d'Application
1. Vérifier les logs Sentry
2. Rollback vers la dernière version stable si nécessaire
3. Redéployer via Render.com

### Scénario 3: Problèmes de Performance
1. Vérifier les métriques Sentry
2. Ajuster les ressources dans Render.com
3. Optimiser les requêtes si nécessaire

## Maintenance

### Maintenance Régulière
- Vérification hebdomadaire des logs
- Mise à jour mensuelle des dépendances
- Test de restauration trimestriel
- Revue de performance trimestrielle

### Mises à Jour
1. Créer une branche de développement
2. Tester localement
3. Déployer sur un environnement de staging
4. Merger vers main après validation

## Contacts

- Support Render: support@render.com
- Support MongoDB: https://support.mongodb.com
- Support Sentry: https://sentry.io/support/

## Checklist de Sécurité

- [ ] Vérifier les certificats SSL
- [ ] Rotation des secrets tous les 90 jours
- [ ] Audit des accès tous les 30 jours
- [ ] Scan de vulnérabilités mensuel 