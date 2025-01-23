# Documentation API Flegm

## 🔑 Authentification

Toutes les routes protégées nécessitent un token JWT dans le header :
```
Authorization: Bearer <token>
```

## 📍 Points d'entrée

### Posts

#### GET /api/posts
Récupère la liste des posts.

**Paramètres de requête**
- `sort` : 'popular' | 'newest' (défaut: 'popular')
- `limit` : number (défaut: 20)
- `page` : number (défaut: 1)

**Réponse**
```json
{
  "posts": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "videoUrl": "string",
      "thumbnailUrl": "string",
      "creator": {
        "_id": "string",
        "username": "string",
        "avatar": "string"
      },
      "tags": ["string"],
      "upvoteCount": "number",
      "commentCount": "number",
      "createdAt": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "totalPages": "number"
}
```

#### POST /api/posts
Crée un nouveau post.

**Corps de la requête**
```json
{
  "title": "string",
  "description": "string",
  "videoUrl": "string",
  "tags": ["string"]
}
```

#### GET /api/posts/:id
Récupère un post spécifique.

#### PUT /api/posts/:id
Met à jour un post.

#### DELETE /api/posts/:id
Supprime un post.

#### POST /api/posts/:id/upvote
Vote pour un post.

### Commentaires

#### GET /api/posts/:id/comments
Récupère les commentaires d'un post.

#### POST /api/posts/:id/comments
Ajoute un commentaire.

### Utilisateurs

#### POST /api/auth/register
Inscription d'un nouvel utilisateur.

**Corps de la requête**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "isCreator": "boolean"
}
```

#### POST /api/auth/login
Connexion d'un utilisateur.

**Corps de la requête**
```json
{
  "email": "string",
  "password": "string"
}
```

#### GET /api/auth/me
Récupère le profil de l'utilisateur connecté.

### OAuth

#### GET /api/auth/google
Authentification Google.

#### GET /api/auth/facebook
Authentification Facebook.

#### GET /api/auth/tiktok
Authentification TikTok.

## 📤 Upload

#### POST /api/upload/signature
Récupère une signature pour l'upload Cloudinary.

#### POST /api/upload
Upload d'un fichier média.

## ⚠️ Gestion des erreurs

Les erreurs sont retournées au format suivant :
```json
{
  "message": "Description de l'erreur",
  "code": "ERROR_CODE"
}
```

### Codes d'erreur communs
- `400` : Requête invalide
- `401` : Non authentifié
- `403` : Non autorisé
- `404` : Ressource non trouvée
- `429` : Trop de requêtes
- `500` : Erreur serveur

## 🔄 Limites de taux

- API générale : 100 requêtes par IP par 15 minutes
- Upload : 5 uploads par IP par 15 minutes
- Authentification : 10 tentatives par IP par 15 minutes 