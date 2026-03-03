# Kplɔ́n nǔ — Backend API

API RESTful complète pour la plateforme e-learning **Kplɔ́n nǔ**, construite avec **Express.js 4**, **MongoDB (Mongoose)** et l'**API Gemini** pour le bot pédagogique Mɛsi.

---

## 📁 Arborescence du projet

```
backend/
├── server.js                  # Point d'entrée principal
├── .env                       # Variables d'environnement (ne pas commiter)
├── .env.example               # Template des variables à configurer
├── package.json
└── src/
    ├── app.js                 # Configuration Express (middlewares, routes)
    ├── config/
    │   ├── db.js              # Connexion MongoDB
    │   ├── cloudinary.js      # Cloudinary + Multer (upload médias)
    │   ├── passport.js        # Google OAuth 2.0
    │   └── swagger.js         # Documentation Swagger/OpenAPI
    ├── models/
    │   ├── User.model.js      # Étudiant & Professeur (rôles, plan, quota)
    │   ├── Video.model.js     # Vidéos publiques (commentaires, réactions)
    │   ├── Classroom.model.js # Salles de classe (code d'invitation, inscrits)
    │   ├── Course.model.js    # Supports de cours (texte ou PDF)
    │   ├── Exercise.model.js  # Exercices & TPs
    │   ├── Submission.model.js# Soumissions des étudiants (fichier/lien)
    │   └── Session.model.js   # Sessions de visioconférence (présences)
    ├── controllers/
    │   ├── auth.controller.js       # Inscription, connexion, OAuth, profil
    │   ├── video.controller.js      # CRUD vidéos, réactions, commentaires
    │   ├── classroom.controller.js  # Salles, validation étudiants
    │   ├── course.controller.js     # Cours texte/PDF
    │   ├── exercise.controller.js   # Exercices, soumissions, correction
    │   ├── session.controller.js    # Visioconférence, présences
    │   └── bot.controller.js        # Bot Mɛsi (Gemini AI, flashcards)
    ├── middlewares/
    │   ├── auth.middleware.js  # JWT protect, authorize (RBAC), optionalAuth
    │   ├── plan.middleware.js  # Quotas FREE/PREMIUM
    │   └── error.middleware.js # Gestionnaire d'erreurs global
    ├── routes/
    │   ├── auth.routes.js
    │   ├── video.routes.js
    │   ├── classroom.routes.js
    │   ├── course.routes.js
    │   ├── exercise.routes.js
    │   ├── session.routes.js
    │   └── bot.routes.js
    └── utils/
        ├── jwt.utils.js        # Génération de tokens JWT
        └── cron.utils.js       # Cron job : reset quota Bot Mɛsi à minuit
```

---

## ⚙️ Installation locale

### Prérequis
- Node.js **v18+**
- MongoDB (local ou [MongoDB Atlas](https://www.mongodb.com/atlas))
- Un compte [Cloudinary](https://cloudinary.com) (plan gratuit suffisant)
- Une clé [Gemini API](https://aistudio.google.com/app/apikey) (Google AI Studio)
- Un projet [Google Cloud Console](https://console.cloud.google.com) avec OAuth 2.0 configuré

### Étapes

```bash
# 1. Cloner le dépôt et entrer dans le backend
cd backend

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# → Ouvrir .env et remplir toutes les valeurs (voir section Variables)

# 4. Lancer en développement (avec rechargement automatique)
npm run dev
```

Le serveur démarre sur **http://localhost:5000**

---

## 🔐 Variables d'environnement (`.env`)

| Variable | Description | Exemple |
|---|---|---|
| `PORT` | Port du serveur | `5000` |
| `NODE_ENV` | Environnement | `development` ou `production` |
| `MONGO_URI` | URI MongoDB | `mongodb://localhost:27017/kplon-nu` |
| `JWT_SECRET` | Clé secrète JWT (chaîne aléatoire longue) | `abc123...` |
| `JWT_EXPIRE` | Durée du token | `30d` |
| `FRONTEND_URL` | URL du frontend (CORS) | `http://localhost:5173` |
| `GOOGLE_CLIENT_ID` | Client ID Google OAuth | De Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Secret Google OAuth | De Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | URL de callback OAuth | `http://localhost:5000/api/v1/auth/google/callback` |
| `GEMINI_API_KEY` | Clé API Gemini (Bot Mɛsi) | De Google AI Studio |
| `CLOUDINARY_CLOUD_NAME` | Nom du cloud Cloudinary | De votre dashboard Cloudinary |
| `CLOUDINARY_API_KEY` | Clé API Cloudinary | De votre dashboard Cloudinary |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary | De votre dashboard Cloudinary |

---

## 🌍 Endpoints API principaux

La documentation interactive complète est disponible sur **`/api/v1/docs`** (Swagger UI).

### Authentification `/api/v1/auth`
| Méthode | Endpoint | Description | Accès |
|---|---|---|---|
| POST | `/register/student` | Inscription étudiant | Public |
| POST | `/register/professor` | Inscription professeur | Public |
| POST | `/login` | Connexion email/password | Public |
| GET | `/google` | Connexion Google OAuth | Public |
| GET | `/google/callback` | Callback OAuth (auto) | Public |
| PUT | `/complete-profile` | Finaliser profil OAuth | Authentifié |
| GET | `/me` | Mon profil | Authentifié |

### Vidéos `/api/v1/videos`
| Méthode | Endpoint | Description | Accès |
|---|---|---|---|
| GET | `/` | Lister toutes les vidéos (paginées) | Public |
| GET | `/:id` | Obtenir une vidéo | Public |
| POST | `/` | Publier une vidéo | Professeur |
| DELETE | `/:id` | Supprimer une vidéo | Propriétaire |
| POST | `/:id/react` | Like / Dislike | Authentifié |
| POST | `/:id/comments` | Commenter | Authentifié |
| POST | `/:id/comments/:commentId/replies` | Répondre à un commentaire | Authentifié |

### Salles de classe `/api/v1/classrooms`
| Méthode | Endpoint | Description | Accès |
|---|---|---|---|
| POST | `/` | Créer une salle (max 10 FREE) | Professeur |
| GET | `/mine` | Mes salles | Professeur |
| GET | `/my-enrollments` | Mes inscriptions | Étudiant |
| POST | `/join` | Rejoindre via code d'invitation | Étudiant |
| GET | `/:id` | Détails d'une salle | Membre |
| GET | `/:id/pending` | Demandes en attente | Professeur |
| PUT | `/:id/validate` | Valider/rejeter des étudiants (masse) | Professeur |

### Cours `/api/v1/classrooms/:classroomId/courses`
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/` | Lister les cours |
| POST | `/` | Publier un cours (texte ou PDF) |
| DELETE | `/:id` | Supprimer un cours |

### Exercices `/api/v1/classrooms/:classroomId/exercises`
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/` | Lister les exercices |
| POST | `/` | Créer un exercice/TP |
| POST | `/:exerciseId/submit` | Soumettre (fichier ZIP ou lien) |
| GET | `/:exerciseId/submissions` | Voir les soumissions |
| PUT | `/submissions/:id/grade` | Corriger une soumission |

### Sessions live `/api/v1/classrooms/:classroomId/sessions`
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/` | Lister les sessions programmées |
| POST | `/` | Créer une session |
| PUT | `/:id/start` | Démarrer (status LIVE) |
| PUT | `/:id/end` | Terminer (status ENDED) |
| POST | `/:id/join` | Rejoindre (enregistre PRESENT/LATE/ABSENT) |

### Bot Mɛsi `/api/v1/bot`
| Méthode | Endpoint | Description | Limite FREE |
|---|---|---|---|
| POST | `/ask` | Poser une question | 20/jour |
| POST | `/flashcards` | Générer des flashcards | Illimité |

---

## 🚀 Déploiement en production

### Option 1 : Render (Recommandé — gratuit, supporte Node.js en continu)

1. **Créer un compte** sur [render.com](https://render.com)
2. **Nouveau service Web** → Connecter votre dépôt GitHub/GitLab
3. **Configurer :**
   - **Root Directory** : `backend`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Runtime** : Node
4. **Variables d'environnement** : Ajouter toutes les variables du `.env` dans le dashboard Render
5. **Important** : Changer `MONGO_URI` vers une URI [MongoDB Atlas](https://www.mongodb.com/atlas) pour la production
6. **Important** : Mettre `NODE_ENV=production` et changer `FRONTEND_URL` vers l'URL de votre frontend déployé
7. **Important** : Mettre à jour `GOOGLE_CALLBACK_URL` vers votre domaine Render

### Option 2 : Railway

1. Créer un compte sur [railway.app](https://railway.app)
2. **Nouveau projet** → Deploy from GitHub
3. Ajouter un service **MongoDB** (Railway le fournit), copier l'URI
4. Ajouter les variables d'environnement
5. Railway détecte automatiquement Node.js et lance `npm start`

### Option 3 : Fly.io (Avec Docker)

Créer un `Dockerfile` à la racine du backend :
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
fly launch        # Configure automatiquement
fly secrets set MONGO_URI="..." JWT_SECRET="..." # etc.
fly deploy
```

### Configuration MongoDB Atlas (Production)

1. Créer un cluster gratuit sur [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Database Access** : Créer un utilisateur (noter le mot de passe)
3. **Network Access** : Ajouter `0.0.0.0/0` (accès depuis n'importe où, pour l'hébergement)
4. **Connect** → **Drivers** → Copier l'URI, remplacer `<password>` par votre mot de passe
5. Mettre cette URI dans `MONGO_URI` sur votre plateforme d'hébergement

### Google OAuth en production

Dans [Google Cloud Console](https://console.cloud.google.com) > Identifiants > Votre Client OAuth :
- Ajouter dans **Origines JavaScript autorisées** : `https://votre-domaine.onrender.com`
- Ajouter dans **URI de redirection autorisés** : `https://votre-domaine.onrender.com/api/v1/auth/google/callback`

---

## 🛠 Guide de maintenance

### Ajouter une nouvelle entité
1. Créer le modèle dans `src/models/NomEntite.model.js`
2. Créer le controller dans `src/controllers/nomEntite.controller.js`
3. Créer les routes dans `src/routes/nomEntite.routes.js` avec les annotations `@swagger`
4. Monter la route dans `src/app.js`

### Modifier un modèle Mongoose existant
- Ajouter le champ avec une valeur `default` pour ne pas casser les documents existants
- Mettre à jour la validation Joi dans le controller correspondant
- ⚠️ Ne jamais supprimer un champ sans migration préalable

### Règles de sécurité absolues
- **Ne jamais** exposer le `JWT_SECRET` ou les clés API dans le code source
- **Toujours** utiliser le middleware `protect` sur les routes privées
- **Toujours** valider les données entrantes (Joi) avant de les persister
- La logique de quota **doit** rester côté serveur (middlewares `plan.middleware.js`)
