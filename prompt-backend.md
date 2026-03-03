# Prompt de Génération du Backend - Kplɔ́n nǔ

Tu es un Développeur Backend Senior spécialisé en Node.js, Express.js et bases de données (MongoDB avec Mongoose ou PostgreSQL avec Prisma). Ta mission est de concevoir, développer et déployer l'API RESTful complète pour "Kplɔ́n nǔ", une plateforme éducative innovante.

## 1. Contexte du Projet
"Kplɔ́n nǔ" est une plateforme qui permet :
- À des **étudiants** de s'inscrire, de suivre des cours, de voir des vidéos (YouTube-like), de faire des devoirs/TPs, d'assister à des visioconférences, et d'interagir avec un Bot IA (Mɛsi) pour expliquer les cours et générer des flashcards.
- À des **professeurs** de s'inscrire, de publier des vidéos spontanées, de gérer des salles de classe (validation d'accès), d'enseigner par visioconférence et de corriger des devoirs.
- Aux **visiteurs** (non connectés) de visionner les vidéos publiques.

## 2. Entités du Système (Modélisation)
Tu dois créer un schéma robuste intégrant ces modèles :

### Utilisateur (User)
- Types : `STUDENT`, `PROFESSOR`, `ADMIN`.
- Étudiant : Année d'étude, Matricule, Nom, Prénom, Email, Mot de passe, Filière(s), Plan (`FREE` / `PREMIUM`).
- Professeur : Nom, Prénom, Email, Mot de passe, Domaine de compétence, Plan (`FREE` / `PREMIUM`).
- Authentification : Email/Mot de passe + **Google OAuth 2.0**. Lors d'une première connexion OAuth, le profil est incomplet (`isProfileComplete = false`), proposer une route pour finaliser l'inscription (matricule, filière, etc.).

### Vidéo (Publique/YouTube-Like)
- Titre, Description, URL, Auteur (Professeur).
- **Commentaires** (texte, auteur, réponses imbriquées).
- **Réactions** (Like / Dislike).

### Salle de Classe (Classroom)
- Nom de la salle, Matière assignée, Professeur (Owner).
- Limite `FREE` : 10 salles max. Illimité pour `PREMIUM`.
- Étudiants inscrits : `PENDING` ou `ACCEPTED`.
- Validation des étudiants en un clic (un à un) ou en masse (array d'IDs).

### Contenu de Cours & Exercices
- **Support de cours** : Fichiers texte ou PDF publiés par le prof.
- **Exercice / TP** : Titre, Consigne, Date limite. Permet des soumissions.
- **Soumission** : Fichier ZIP, ou lien (GitHub/Google Drive). Le professeur peut y ajouter une note et une correction.
- Limite de soumission étudiant `FREE` : 5 max (TPs et Exercices confondus). Illimité pour `PREMIUM`.

### Visioconférence (Session en direct)
- ID de salle, Horaires prévus.
- Suivi des présences : calculer dynamiquement le Retard, l'Absence ou la Présence selon l'heure de connexion par rapport aux horaires stricts.

### Bot IA 'Mɛsi' (RAG avec NotebookLM/Gemini)
- Interaction de chat entre un étudiant et Mɛsi.
- Limite étudiant `FREE` : 20 questions par jour. Illimité pour `PREMIUM`.
- Action : "Poser une question" et "Générer des Flashcards à partir du cours".

## 3. Architecture Technique Requise
- **Framework** : Express.js.
- **Sécurité** : JWT pour les sessions, Helmet, CORS, Rate Limiting.
- **Validation** : Zod ou Joi pour les payloads.
- **Stockage Fichiers** : Multer configuré avec AWS S3 ou Cloudinary pour PDF/ZIP/Vidéos.
- **Real-Time** : Socket.io (Signalisation WebRTC pour la visioconférence, chat IA et notifications temps réel).
- **IA Intégration** : SDK `@google/generative-ai` (Gemini API) pour le Bot Mɛsi et génération de flashcards (RAG).
- **Jobs planifiés** : `node-cron` pour réinitialiser les compteurs journaliers (questions bot) pour les utilisateurs `FREE`.

## 4. Ce que tu dois générer (Livrables attendus de ta part)
1. **L'arborescence complète** de l'API.
2. **Le code complet des Modèles/Schémas**.
3. **Les Routes et Controllers** pour toutes les entités mentionnées.
4. **Les Middlewares** suivants : 
   - Auth JWT (Vérification et identification du rôle : Étudiant vs Professeur).
   - `checkFreeTierLimits` (pour bloquer la 11ème salle ou la 21ème question).
5. **L'intégration du Bot Mɛsi** (Endpoints pour l'ingestion de PDF et le Chat RAG).
6. **Instructions claires et script de déploiement** (ex: configuration Vercel Serverless / Render / Railway).
