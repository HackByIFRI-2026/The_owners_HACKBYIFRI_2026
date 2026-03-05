<ArtifactMetadata><ArtifactType>other</ArtifactType><Summary>A Markdown file providing the final deliverables: a 2-minute pitch of the Kplon nu platform and comprehensive instructions for hosting and linking the frontend and backend applications to prepare them for a client.</Summary></ArtifactMetadata># Présentation et Déploiement de "Kplon nu"

## 1. Pitch de Présentation (Durée : ~1 minute 30 à 2 minutes)

**Introduction (Accroche - 15s)**
« Bonjour ! Face aux défis de l'enseignement hybride et à la nécessité de moderniser le suivi pédagogique en Afrique, il y a une vraie fracture. Comment garantir qu'un étudiant, où qu'il soit, puisse suivre son programme, interagir avec ses professeurs, et valider ses connaissances sans coupures ni frustration technique ? Voici "Kplon nu". »

**La Solution (Fonctionnalités & Valeur - 45s)**
« "Kplon nu" n'est pas qu'une simple plateforme e-learning, c'est un **environnement numérique de travail complet, unifié et intelligent**. 
Pour les **Étudiants** : Un dashboard interactif leur permet de suivre leur progression en temps réel (statistiques, XP, quiz), d'accéder à des cours vidéo fluides et d'avoir un assistant IA, Mɛsi, pour les guider 24h/24. 
Pour les **Professeurs** : C'est une tour de contrôle absolue. Le professeur peut créer des salles de classe, uploader ses propres cours PDF et vidéos, créer des devoirs interactifs avec date limite, et visualiser d'un seul clic les statistiques de chaque étudiant: qui avance bien, qui décroche. C'est du suivi granulaire et préventif.
Tout est conçu avec une esthétique premium, moderne (dark mode, glassmorphism), sans superflu. »

**Le Modèle & Scalabilité (Architecture - 20s)**
« Techniquement, nous avons séparé un Frontend en React.js ultrarapide et un Backend Node.js de haute performance pour assurer la scalabilité. L'architecture supporte les notifications en temps réel, l'authentification robuste (JWT) et est déjà prête à accueillir un grand nombre d'utilisateurs avec un schéma économique Premium. »

**Conclusion (Appel à l'action - 10s)**
« Aujourd'hui, "Kplon nu" est la clé en main, prête à être commercialisée pour les institutions scolaires souhaitant un bond technologique. Merci de votre attention. »

---

## 2. Guide d'Hébergement et de Déploiement

Ce guide vous explique comment héberger de manière professionnelle la solution `Kplon nu` en liant le frontend et le backend.

### Pré-requis
- Un compte **Render**, **Railway**, ou un **VPS** (DigitalOcean / Heroku).
- Un compte **Vercel** ou **Netlify** pour le Frontend.
- Une base de données **MongoDB Atlas** (Cloud).

### Étape 1 : Déploiement du Backend (Node.js/Express)
Nous recommandons Render ou Heroku pour le Backend :

1. **Environnement** : Modifiez le fichier `.env` du backend en production :
   ```env
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://<votre-user>:<votre-password>@cluster0.mongodb.net/kplonnu?retryWrites=true&w=majority
   JWT_SECRET=super_secret_jwt_key_long_and_secure
   CLIENT_URL=https://kplonnu-app.vercel.app  # L'URL de votre frontend !
   ```

2. **Hébergement** : 
   - Poussez le dossier `backend` sur GitHub.
   - Sur l'interface (ex: Render), créez un nouveau "Web Service" et connectez ce repository GitHub.
   - **Build Command** : `npm install`
   - **Start Command** : `npm start` (ou `node src/app.js`)
   - N'oubliez pas d'insérer les variables d'environnement (`.env`) dans le Dashboard de l'hébergeur.
   - Le backend va vous générer une URL de type : `https://kplonnu-api.onrender.com`.

### Étape 2 : Configuration et Déploiement du Frontend (React)
Nous recommandons Vercel ou Netlify (idéal et gratuit pour React) :

1. **Lier le Frontend au Backend** :
   Dans le dossier `frontend`, ouvrez votre fichier `src/services/api.js` (ou `.env` si configuré via Vite).
   Vérifiez que l'URL de base pointe vers votre nouveau backend :
   ```javascript
   // Dans src/services/api.js
   const baseURL = import.meta.env.VITE_API_URL || 'https://kplonnu-api.onrender.com/api/v1';
   ```
   Si vous utilisez un `.env` côté frontend :
   ```env
   VITE_API_URL=https://kplonnu-api.onrender.com/api/v1
   ```

2. **Hébergement** :
   - Poussez le dossier `frontend` sur GitHub.
   - Allez sur **Vercel** > *Add New Project* > Importez le dépôt Frontend.
   - **Framework Preset** : Vite.
   - **Build Command** : `npm run build`
   - **Install Command** : `npm install`
   - Ajoutez le `VITE_API_URL` dans les *Environment Variables* de Vercel.
   - Cliquez sur **Deploy**.

### Étape 3 : Tests Post-Déploiement
- Ouvrez l'URL de Vercel générée (ex: `https://kplonnu-app.vercel.app`).
- Vérifiez l'inscription / la connexion. (Les cookies ou les tokens JWT doivent bien passer, `CLIENT_URL` réglé dans les CORS du backend empêche les erreurs de requêtes inter-domaines).
- Testez la mise en ligne d'une photo de profil ou de fichiers pour vous assurer que les droits en écriture sur le serveur (ou Cloudinary) sont bien configurés.

La plateforme est en ligne et fonctionnelle.
