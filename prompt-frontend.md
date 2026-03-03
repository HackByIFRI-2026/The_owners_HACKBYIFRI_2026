# Prompt de Génération du Frontend React.js - Kplɔ́n nǔ

Tu es un développeur Frontend Senior expert en React.js (Vite ou Next.js), UI/UX Design et Tailwind CSS. 
L'API Backend de "Kplɔ́n nǔ" (une plateforme éducative de cours, visioconférence et IA) est déjà fonctionnelle. Ta mission est de générer le Frontend de ce projet en respectant une **charte graphique parfaite**, **innovante**, **attractive** et **professionnelle** tout en restant dans les limites des réalisations humaines (pas de designs impossibles à coder).

## 1. Contexte et Charte Graphique
- **Nom du projet** : Kplɔ́n nǔ
- **Slogan** : "Apprendre ensemble, grandir ensemble"
- **Langue** : Français
- **Objectif** : Créer une plateforme éducative de cours, visioconférence et IA.
- **Public cible** : Étudiants et professeurs.
- **Logo** : Logo de Kplɔ́n nǔ (à générer)
- **Description du logo** : Un logo moderne et professionnel représentant un livre ouvert avec une plante verte sortant de celui-ci, symbole de croissance et d'apprentissage. Le logo doit être simple, élégant et facilement reconnaissable. Le logo doit être vectoriel et facilement redimensionnable.
- **UI/UX** : Le design doit paraître premium (Glassmorphism subtil, mode sombre/clair élégant, micro-animations Framer Motion, typographie moderne type "Inter" ou "Outfit").
- **Couleurs dominantes** : Utiliser une palette moderne, par exemple un bleu profond (Trust, Learning) avec des accents dynamiques (ex: Orange/Corail pour les appels à l'action et les notifications).
- **Accessibilité & Responsive** : Le site doit être 100% responsive (Mobile First) et accessible (contraste des couleurs, lecteur d'écran).
- **Design Premium** : Le design doit être moderne, attrayant et professionnel. Il doit utiliser des techniques de design avancées telles que le glassmorphism, les micro-animations et une typographie élégante. Le site doit être 100% responsive et accessible (Mobile First).

## 2. Bibliothèques Restreintes et Architecture
- **Framework** : React.js (via Vite) ou Next.js.
- **Styling** : Tailwind CSS + Shadcn UI ou Material UI (MUI) configuré pour un look customisé.
- **Gestion d'État** : Zustand ou Redux Toolkit.
- **Appels API** : Axios avec React Query (TanStack Query) pour gérer le cache, le chargement et les erreurs.
- **Visioconférence** : WebRTC avec Socket.io-client (ou intégration SDK Agora.io / Jitsi Iframe).
- **Lecteur Vidéo** : `react-player` pour le streaming YouTube-like.
- **Routing** : React Router v6 (si Vite) ou App Router (si Next.js).

## 3. Les Vues (Pages) à Implémenter
1. **Landing Page** :
   - Héro section ultra-attractive, présentation du bot Mɛsi, témoignages, boutons "S'inscrire / Se Connecter".
2. **Authentification (Auth)** :
   - Login / Register.
   - Bouton "Continuer avec Google".
   - Écran "Compléter le profil" (si 1ère connexion Google) demandant le rôle (Étudiant/Prof), domaine, matricule, filière.
3. **Espace Public (YouTube-Like)** :
   - Grille de vidéos postées par les professeurs (filtrables par sujet).
   - Page de visionnage avec lecteur vidéo, section commentaires (réponses imbriquées) et boutons Like/Dislike.
4. **Tableau de Bord Professeur** :
   - Créer/Gérer ses Salles de classes (jusqu'à 10 pour le plan gratuit, indicateur visuel du quota).
   - Valider les demandes d'accès (liste `[ Accepter ] / [ Rejeter ]` ou case à cocher pour validation globale).
   - Lancer une visioconférence.
   - Publier un cours (PDF/Texte) ou un TP/Exercice.
   - Noter les soumissions (liens zip, Github, Drive).
5. **Tableau de Bord Étudiant** :
   - Demander à rejoindre une salle, voir les salles actuelles.
   - Soumettre un TP/Exercice (avec limite de 5 pour le plan Free).
   - Suivre les visioconférences (bouton "Rejoindre le live").
6. **Interface "Chat Bot Mɛsi" (IA)** :
   - Fenêtre de chat intuitive rappelant l'interface ChatGPT/Gemini.
   - Indicateur de quota de questions (ex: "Vous avez posé 5/20 questions aujourd'hui").
   - Bouton "Générer des Flashcards" depuis le cours affiché.
   - Interface de révision par Flashcards (cartes interactives qui se retournent).

## 4. Les endpoints à respecter
Agis en tant que développeur Frontend Expert. Ton objectif est d'intégrer le backend existant de "Kplɔ́n nǔ" (une plateforme e-learning béninoise avec IA) dans notre application frontend (React/Vite).

Le backend tourne localement sur http://localhost:5001/api/v1 et utilise une architecture REST. L'authentification se fait via un token JWT (à inclure dans l'en-tête Authorization: Bearer <token>). Les téléchargements de fichiers se font via multipart/form-data (Cloudinary est géré côté backend).

Voici la liste exhaustive des endpoints disponibles que tu devras intégrer :

1. Authentification (/api/v1/auth)
- POST /register/student : Inscrire un étudiant. Body requis: firstName, lastName, email, password, studyYear, studentId, majors (array).
- POST /register/professor : Inscrire un professeur. Body requis: firstName, lastName, email, password, expertiseField.
- POST /login : Se connecter. Body requis: email, password. Retourne le token JWT.
- GET /google : Initie la connexion OAuth Google.
- GET /google/callback : Callback de Google (géré automatiquement, renvoie vers le front avec le token).
- PUT /complete-profile : Compléter le profil après une inscription Google OAuth. (Auth requise)
- GET /me : Récupérer les informations de l'utilisateur actuellement connecté. (Auth requise)
2. Vidéos Publiques (/api/v1/videos)
- GET / : Lister les vidéos (pagination ?page=1&limit=12). Optionnel Auth.
- GET /:id : Voir les détails d'une vidéo (incrémente les vues). Optionnel Auth.
- POST / : Publier une vidéo (Professeur uniquement). Form-data : title, description, commentsEnabled, video (fichier vidéo).
- DELETE /:id : Supprimer sa propre vidéo (Professeur uniquement).
- POST /:id/react : Liker ou disliker une vidéo. (Auth requise)
- POST /:id/comments : Ajouter un commentaire. (Auth requise)
- POST /:id/comments/:commentId/replies : Répondre à un commentaire. (Auth requise)
3. Salles de classe (/api/v1/classrooms)
- POST / : Créer une salle. (Professeur). Body: name, subject, description.
- GET /mine : Lister les salles créées par moi. (Professeur).
- GET /my-enrollments : Lister les salles où je suis accepté. (Étudiant).
- POST /join : Demander à rejoindre une salle. (Étudiant). Body: inviteCode.
- GET /:id : Afficher les détails d'une salle de classe.
- PUT /:id/validate : Accepter/Rejeter des étudiants. (Professeur). Body: studentIds (array), action ("ACCEPTED" ou "REJECTED").
- GET /:id/pending : Obtenir la liste des demandes en attente pour cette salle. (Professeur).
4. Cours / Supports (/api/v1/classrooms/:classroomId/courses)
- GET / : Lister les cours de la salle de classe.
- POST / : Publier un cours. (Professeur). Form-data: title, type ("TEXT" ou "PDF"), textContent, file (fichier PDF).
- DELETE /:id : Supprimer un cours de la salle. (Professeur).
5. Exercices et Soumissions (/api/v1/classrooms/:classroomId/exercises & /api/v1/exercises)
- GET /classrooms/:classroomId/exercises/ : Lister les exercices de la salle.
- POST /classrooms/:classroomId/exercises/ : Créer un exercice. (Professeur). Form-data: title, description, dueDate, attachment (optionnel).
- POST /classrooms/:classroomId/exercises/:exerciseId/submit : Soumettre un travail. (Étudiant). Form-data: file (fichier de rendu).
- GET /classrooms/:classroomId/exercises/:exerciseId/submissions : Lister les rendus des étudiants pour cet exercice. (Professeur).
- PUT /classrooms/:classroomId/exercises/submissions/:id/grade : Corriger/Noter une soumission. (Professeur). Form-data: score, feedbackText, feedbackFile (optionnel).
6. Sessions Live / Visioconférences
- GET /api/v1/classrooms/:classroomId/sessions : Lister les sessions planifiées/en cours de la salle.
- POST /api/v1/classrooms/:classroomId/sessions : Créer une session live. (Professeur). Body: title, description, startTime, scheduledDuration.
- POST /api/v1/sessions/:id/join : Rejoindre une session et pointer présent. (Étudiant).
- PUT /api/v1/sessions/:id/start : Démarrer la session en direct. (Professeur).
- PUT /api/v1/sessions/:id/end : Terminer la session. (Professeur).
7. Assistant IA Mɛsi (/api/v1/bot)
- POST /ask : Poser une question au bot. (Étudiant). Body: question, courseContext.
- POST /flashcards : Générer des cartes mémoires. (Étudiant). Body: courseContent, numberOfCards.

Prends connaissance de toutes ces routes. Ton travail consistera à créer des services d'API propres (ex: via Axios ou Fetch), des hooks React (ex: useQuery, useMutation), et à gérer correctement les états de chargement, d'erreurs, ainsi que les restrictions liées au rôle (Étudiant vs Professeur). Confirme-moi que tu as bien lu et compris la structure !


## 5. Ce que tu dois générer
1. **Structure du projet frontend** (Arborescence `/src/components`, `/src/pages`, `/src/hooks`, `/src/store`).
2. **Configuration TailwindCSS** et configuration globale des styles (`index.css` ou `globals.css`).
3. **Composants clés détaillés** (ex: `VideoPlayer`, `ClassroomCard`, `ChatBotUI`, `AuthModal`).
4. **Hooks API** avec Axios & React Query pour lier le frontend au backend (ex: `useCreateClassroom()`, `useSubmitExercise()`).

Démarre immédiatement en initialisant la structure de base (App, Router, Layouts principaux). Maintiens un code ultra-propre et lisible.
