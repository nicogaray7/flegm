# Validation des accès API Google Cloud — Flegm (production)

Ce document indique quoi renseigner dans la Google Cloud Console pour une mise en production propre de Flegm (flegm.fr).

---

## 1. Contexte

Flegm utilise :

- **YouTube Data API v3** (clé API) : métadonnées des vidéos (soumission, durée, vues, likes). Appels **côté serveur** uniquement (Next.js sur Vercel + bot sur VPS).
- **Google OAuth 2.0** (via Supabase Auth) : connexion « Se connecter avec Google » sur le site.

---

## 2. OAuth 2.0 (écran de consentement + identifiants)

### 2.1 Type d’application

- **Type** : Application Web

### 2.2 URI autorisés

À configurer dans **APIs & Services → Identifiants → [votre client OAuth 2.0] → URI de redirection autorisés** et **Origines JavaScript autorisées**.

**Origines JavaScript autorisées :**

| Origine |
|--------|
| `https://flegm.fr` |
| `https://www.flegm.fr` |

*(Ajoutez `https://*.vercel.app` uniquement si vous voulez que « Se connecter avec Google » fonctionne aussi sur les déploiements de prévisualisation Vercel.)*

**URI de redirection autorisés :**

| URI |
|-----|
| `https://ntybytfiaerwaczkkxdw.supabase.co/auth/v1/callback` |

Supabase gère le retour OAuth ; c’est cette URL que Google doit autoriser. Si vous utilisez un autre projet Supabase en prod, remplacez l’ID projet dans l’URL.

### 2.3 Écran de consentement OAuth (pour la vérification)

- **Nom de l’application** : Flegm (ou « Flegm — Découvrir des vidéos »)
- **Page d’accueil de l’application** : `https://flegm.fr`
- **Politique de confidentialité** : `https://flegm.fr/fr/privacy`  
  (ou `https://flegm.fr/en/privacy` si le formulaire demande une seule URL en anglais)
- **Conditions d’utilisation** (si demandé) : `https://flegm.fr/fr/terms`  
  (ou `https://flegm.fr/en/terms`)
- **Adresse e-mail d’assistance** : par ex. `contact@flegm.fr` (ou l’email du compte Google Cloud)
- **Logo** : utiliser le logo Flegm (favicon du site) :
  - **Fichier dans le repo** : [`web/docs/flegm-logo.svg`](flegm-logo.svg)
  - **Lien direct pour télécharger** (GitHub raw) :  
    `https://github.com/nicogaray7/flegm/raw/main/web/docs/flegm-logo.svg`  
  Si Google n’accepte que PNG/JPG, ouvrir ce SVG dans un navigateur ou outil (Figma, etc.) et exporter en **120×120 px**.

---

## 3. YouTube Data API v3 (clé API)

- Les appels sont faits **uniquement depuis vos serveurs** (Next.js sur Vercel, bot sur le VPS), pas depuis le navigateur.
- Dans **Identifiants → Clés API → [votre clé] → Restreindre la clé** :
  - **Restriction d’application** : « Adresses IP (serveurs web, tâches cron, etc.) » si vous pouvez lister les IP (Vercel + VPS), **ou** laisser sans restriction d’application si vous restreignez aux APIs (recommandé au minimum).
  - **Restriction d’API** : « Restreindre la clé » → cocher uniquement **YouTube Data API v3**.

Pour la **vérification / augmentation de quota** (si demandé) :

- **URL de l’application** : `https://flegm.fr`
- **Description** : « Plateforme de curation de vidéos YouTube. La clé API est utilisée côté serveur pour récupérer les métadonnées (titre, durée, chaîne, vues, likes) lors de la soumission d’une vidéo et pour le backfill des statistiques. Aucune donnée utilisateur Google n’est exposée au client. »

---

## 4. Résumé rapide (copier-coller)

**Origines JavaScript autorisées :**

```
https://flegm.fr
https://www.flegm.fr
```

**URI de redirection autorisés :**

```
https://ntybytfiaerwaczkkxdw.supabase.co/auth/v1/callback
```

**URLs pour la vérification (formulaires / OAuth consent screen) :**

- Page d’accueil : `https://flegm.fr`
- Politique de confidentialité : `https://flegm.fr/fr/privacy`
- Conditions d’utilisation : `https://flegm.fr/fr/terms`

---

## 5. Après la configuration

1. Enregistrer les modifications dans la Google Cloud Console.
2. Si vous êtes en « mode test » OAuth : soumettre l’application pour la **vérification** (menu « Passer en production » / « Publish app ») et remplir le formulaire avec les URLs ci-dessus.
3. Vérifier que la connexion « Se connecter avec Google » fonctionne sur https://flegm.fr (et éventuellement sur www).

Si votre projet Supabase de production a un **autre ID** que `ntybytfiaerwaczkkxdw`, remplacez-le dans l’URI de redirection.
