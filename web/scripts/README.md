# Scripts DB

## Migration : colonne `bot_upvotes_count`

Avant d'utiliser le backfill ou le cron, ajouter la colonne si besoin :

```bash
cd web
# Option 1 : générer et appliquer via Drizzle
npm run db:generate
npm run db:migrate

# Option 2 : appliquer le SQL à la main (voir drizzle/0001_add_bot_upvotes_count.sql)
```

---

## Nettoyage des Shorts

Le bot et la web n'acceptent pas les Shorts (durée ≤ 180 s). Pour **supprimer de la base** les vidéos déjà présentes qui sont des shorts :

```bash
cd web
# optionnel : SHORTS_MAX_DURATION_SECONDS=180 (défaut)
npm run db:clean-shorts
```

Variables d'environnement : `DATABASE_URL` (obligatoire). Optionnel : `SHORTS_MAX_DURATION_SECONDS` (défaut 180).

---

## Upvotes aléatoires (vidéos du bot uniquement)

- Les upvotes « simulés » du bot sont stockés dans **`bot_upvotes_count`** (pas dans la table `upvotes`), pour garder la trace de l'origine.
- L'affichage utilise **total = upvotes_count + bot_upvotes_count**.
- À la publication, le bot donne un `bot_upvotes_count` initial (2–8). Le backfill applique une moyenne plus élevée pour les vidéos plus anciennes.

**Lancer le backfill à la main :**

```bash
cd web
export FLEGM_BOT_USER_ID=<uuid du compte bot Supabase>
export DATABASE_URL=...
DRY_RUN=1 npm run db:backfill-bot-upvotes   # test
npm run db:backfill-bot-upvotes              # exécution
```

**Backfill quotidien (cron) :** appeler chaque jour l'API (Vercel Cron, crontab, etc.) :

```
GET /api/cron/backfill-bot-upvotes
Authorization: Bearer <CRON_SECRET>
```

Variables d'environnement côté app : `FLEGM_BOT_USER_ID`, `CRON_SECRET`. Optionnel : `BOT_UPVOTE_BASE` (8), `BOT_UPVOTE_GROWTH` (2), `BOT_UPVOTE_MAX_MEAN` (200), `BOT_UPVOTE_SPREAD` (12).
