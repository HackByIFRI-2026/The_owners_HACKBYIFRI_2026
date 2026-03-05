# Kplɔ́n nǔ - Plateforme Éducative E-Learning & IA

Bienvenue dans le dépôt du projet **Kplɔ́n nǔ** (Apprendre quelque chose), une solution E-learning moderne intégrant des fonctionnalités de Visioconférence, de Streaming Vidéo classique (YouTube-like) et un assistant d'Intelligence Artificielle (Mɛsi).

## Sommaire
1. [Architecture Globale](#architecture-globale)
2. [Prérequis](#prérequis)
3. [Comment Démarrer (Installation)](#comment-démarrer)
4. [Guide de Maintenance : Modifier le Projet sans rien casser](#guide-de-maintenance)
5. [Hébergement et Déploiement](#hébergement-et-déploiement)

---

## Architecture Globale
Le projet suit une architecture découplée (Séparation des préoccupations).
- **Backend** : Node.js / Express.js (REST API, WebSockets via Socket.io).
- **Frontend** : React.js (Vite ou Next.js) avec Tailwind CSS.
- **Base de Données** : MongoDB (via Mongoose) ou PostgreSQL (via Prisma).
- **Services Cloud** : AWS S3 / Cloudinary (Upload médias), Google OAuth 2.0 (Authentification), Gemini API / NotebookLM (IA Chatbot Mɛsi).

---

## Prérequis
Avant de manipuler le projet, assurez-vous d'avoir installé sur votre machine :
- Node.js (v18+ recommandé)
- npm, yarn ou pnpm
- Git
- Un serveur de base de données (ex: MongoDB Community Server ou une URI Atlas)

---

## Comment Démarrer

### 1. Backend
Placez-vous dans le répertoire du backend :
```bash
cd backend
npm install
```
Copiez le fichier d'environnement et configurez vos variables :
```bash
cp .env.example .env
```
_(Assurez-vous de bien remplir `DB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GEMINI_API_KEY`, etc.)_

Lancez le serveur :
```bash
npm run dev
```

### 2. Frontend
Dans un autre terminal, placez-vous dans le répertoire du frontend :
```bash
cd frontend
npm install
npm run dev
```
Accédez à l'application via `http://localhost:5173` ou l'URL indiquée par le terminal.

---

## Guide de Maintenance : Modifier le Projet sans "gâter" de fonctionnalités

### 1. Ajouter une nouvelle Route API (Backend)
Pour garantir la stabilité de l'API :
1. **Ne modifiez pas les fichiers existants directement** si l'ajout est indépendant.
2. Créez un nouveau contrôleur dans `src/controllers/feature.controller.js`.
3. Créez les routes associées dans `src/routes/feature.routes.js`.
4. Importez les nouvelles routes dans `src/app.js` (ou `server.js`).
5. **Règle d'or** : Testez toujours manuellement avec Postman/Insomnia avant d'intégrer côté React. N'oubliez pas les Middlewares de sécurité (ex: `requireAuth`, `requireProfessor`).

### 2. Ajouter un Composant UI (Frontend)
1. **Atomic Design** : Placez tous les petits éléments réutilisables (Boutons, Inputs, Modals) dans `src/components/ui/`.
2. Placez les sections de page dans `src/components/sections/`.
3. **Gestion d'état** : N'utilisez des états globaux (Zustand/Redux) QUE si l'information doit être partagée entre plusieurs pages (ex: L'utilisateur connecté). Pour tout le reste, utilisez un état local (`useState`).
4. **Appels API** : Ne faites **JAMAIS** d'appel API directement dans un `useEffect` non maîtrisé pour éviter les boucles infinies. Ciblez l'utilisation de **React Query** (`useQuery`, `useMutation`) via des hooks personnalisés dans `src/hooks/`.

### 3. Comment toucher à la base de données ?
Si vous ajoutez un champ à un Model (ex: ajouter "Âge" à `User`) :
- Dans **MongoDB (Mongoose)** : Ajoutez le champ dans le schéma et configurez bien les valeurs par défaut (`default:`). Cédez aux validations intégrées (ex: `min: 0`).
- Mettez toujours à jour la validation du payload entrant (Joi / Zod) dans le controller concerné pour relayer la modification avec sécurité.

### 4. Gestion des quotas (Limites Free/Premium)
Ne mettez **jamais** la logique de quota dans le Frontend pour masquer les boutons. Le Backend est l'unique source de vérité. Le Middleware `checkPlanLimits` du backend doit toujours intercepter la requête.

---

## Hébergement et Déploiement

### Déploiement du Backend
Le backend peut être déployé sur **Render**, **Railway**, ou **Fly.io** (Plateformes gérant Node.js en continu pour les WebSockets).
1. Connectez votre dépôt GitHub à la plateforme.
2. Assurez-vous d'ajouter toutes vos variables d'environnement (`.env`) dans le dashboard du service.
3. Commande de build : `npm install`, Commande de start : `npm start`.

### Déploiement du Frontend
Le frontend React est parfaitement taillé pour **Vercel** ou **Netlify**.
1. Créez un projet projet sur Vercel.
2. Liez votre repos.
3. Définissez la variable `VITE_API_URL` pointant vers **l'URL de votre Backend hébergé**.
4. Déployez !
