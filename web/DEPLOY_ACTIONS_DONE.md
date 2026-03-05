# Actions déjà effectuées (Supabase)

- **Migration** : colonne `bot_upvotes_count` ajoutée sur la table `videos` (projet Supabase « Flegm Platform »).
- **Backfill** : toutes les vidéos du bot (`clippeur_id = 8a6facfe-f26c-4c8f-99a5-1b6252dd9c83`) ont reçu un `bot_upvotes_count` aléatoire (plus élevé pour les plus anciennes).
- **Nettoyage shorts** : 101 vidéos avec `duration <= 180` ont été supprimées (et leurs upvotes/commentaires associés).

---

# À faire manuellement

## 1. Vercel (cron quotidien)

Le navigateur n’était pas connecté à Vercel, donc les variables d’environnement n’ont pas pu être définies depuis ici.

À faire dans le dashboard Vercel (projet qui déploie `web/`) :

1. **Settings → Environment Variables**
2. Ajouter (ou vérifier) :
   - `FLEGM_BOT_USER_ID` = `8a6facfe-f26c-4c8f-99a5-1b6252dd9c83`
   - `CRON_SECRET` = une valeur secrète forte (générée une fois, réutilisée pour appeler le cron)
3. Redéployer si besoin pour que les variables soient prises en compte.

Le fichier `vercel.json` est déjà en place : le cron appelle `GET /api/cron/backfill-bot-upvotes` tous les jours à 6h UTC. Vercel enverra automatiquement `Authorization: Bearer <CRON_SECRET>` si `CRON_SECRET` est défini dans le projet.

## 2. VPS (bot)

Sur le serveur où tourne le bot :

1. Récupérer les derniers changements (seuil Shorts 180 s, `bot_upvotes_count` à la publication) :
   ```bash
   cd /chemin/vers/flegm-bot   # ou ton chemin de déploiement
   git pull
   ```
2. Redémarrer le service du bot (pour charger le nouveau code) :
   ```bash
   # Exemple selon ta config (systemd, pm2, etc.)
   sudo systemctl restart flegm-bot
   # ou
   pm2 restart flegm-bot
   ```

Après ça, le bot ne récupérera plus les Shorts > 60 s (seuil 180 s) et enregistrera bien `bot_upvotes_count` à chaque nouvelle vidéo publiée.
