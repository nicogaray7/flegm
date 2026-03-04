# Indexation Google Search Console — Flegm

Ce document décrit les éléments à fournir et les étapes pour une indexation optimale dans Google Search Console.

## 1. URLs à soumettre

### Sitemap (prioritaire)

Soumettez l’URL du sitemap dans Search Console : **Paramètres d’exploration** → **Sitemaps** → ajouter :

```
https://flegm.fr/sitemap.xml
```

Ce sitemap inclut toutes les URLs par langue (`/en`, `/fr`, `/es`, et toutes les pages sous chaque locale).

### Fichier robots.txt

Vérifiez que les robots peuvent accéder au sitemap. L’URL suivante doit être accessible :

```
https://flegm.fr/robots.txt
```

Elle doit contenir une ligne du type : `Sitemap: https://flegm.fr/sitemap.xml`.

## 2. Structure des URLs (SEO multilingue)

- **Anglais (x-default)** : `https://flegm.fr/en`, `https://flegm.fr/en/leaderboard`, etc.
- **Français** : `https://flegm.fr/fr`, `https://flegm.fr/fr/leaderboard`, etc.
- **Espagnol** : `https://flegm.fr/es`, `https://flegm.fr/es/leaderboard`, etc.

Chaque page envoie des balises **hreflang** (dans le `<head>`) vers les versions en, fr, es et **x-default** (en).

## 3. Vérifications dans Search Console

1. **Propriété** : ajoutez la propriété pour `https://flegm.fr` (préfixe d’URL ou domaine, selon votre configuration).
2. **Sitemaps** : soumettez `https://flegm.fr/sitemap.xml` et attendez le rapport « Pages découvertes / Pages indexées ».
3. **Inspection d’URL** : testez quelques URLs (ex. `https://flegm.fr/fr`, `https://flegm.fr/en/leaderboard`) pour confirmer que la page est « Valide » et que les balises hreflang sont bien détectées.
4. **Couverture / Pages** : surveillez les erreurs d’exploration ou d’indexation et corrigez si besoin.

## 4. Bonnes pratiques déjà en place

- **Canonical** : chaque page a une URL canonique égale à l’URL de la version linguistique affichée.
- **hreflang** : toutes les pages sous `[locale]` exposent `alternates.languages` (en, fr, es, x-default).
- **Sitemap** : toutes les URLs par locale sont listées dans le sitemap.
- **robots.txt** : référence le sitemap ; les chemins `/auth/` et `/submit` peuvent être restreints selon votre stratégie (actuellement seul `/auth/` est exclu de certaines règles si besoin).

## 5. Redirections

- Accès à la racine `https://flegm.fr/` → redirection vers `https://flegm.fr/en` (ou la locale préférée selon le cookie / Accept-Language).
- Anciennes URLs sans préfixe de langue (ex. `/leaderboard`) → redirection vers la même page avec locale (ex. `/en/leaderboard`).

Après déploiement, privilégiez la soumission du sitemap et l’inspection de quelques URLs clés pour valider l’indexation.
