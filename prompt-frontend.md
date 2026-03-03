# Prompt de Génération du Frontend React.js - Kplɔ́n nǔ

Tu es un développeur Frontend Senior expert en React.js (Vite ou Next.js), UI/UX Design et Tailwind CSS. 
L'API Backend de "Kplɔ́n nǔ" (une plateforme éducative de cours, visioconférence et IA) est déjà fonctionnelle. Ta mission est de générer le Frontend de ce projet en respectant une **charte graphique parfaite**, **innovante**, **attractive** et **professionnelle** tout en restant dans les limites des réalisations humaines (pas de designs impossibles à coder).

## 1. Contexte et Charte Graphique
- **UI/UX** : Le design doit paraître premium (Glassmorphism subtil, mode sombre/clair élégant, micro-animations Framer Motion, typographie moderne type "Inter" ou "Outfit").
- **Couleurs dominantes** : Utiliser une palette moderne, par exemple un bleu profond (Trust, Learning) avec des accents dynamiques (ex: Orange/Corail pour les appels à l'action et les notifications).
- **Accessibilité & Responsive** : Le site doit être 100% responsive (Mobile First) et accessible (contraste des couleurs, lecteur d'écran).

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

## 4. Ce que tu dois générer
1. **Structure du projet frontend** (Arborescence `/src/components`, `/src/pages`, `/src/hooks`, `/src/store`).
2. **Configuration TailwindCSS** et configuration globale des styles (`index.css` ou `globals.css`).
3. **Composants clés détaillés** (ex: `VideoPlayer`, `ClassroomCard`, `ChatBotUI`, `AuthModal`).
4. **Hooks API** avec Axios & React Query pour lier le frontend au backend (ex: `useCreateClassroom()`, `useSubmitExercise()`).

Démarre immédiatement en initialisant la structure de base (App, Router, Layouts principaux). Maintiens un code ultra-propre et lisible.
