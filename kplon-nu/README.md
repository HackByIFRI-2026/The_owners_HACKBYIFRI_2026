# 🎓 Kplɔ́n nǔ — Frontend

> **"Apprendre quelque chose"** en fon — Plateforme d'apprentissage pour les étudiants béninois.

## Stack technique
- **React.js 18** + React Router v6
- **Recharts** pour les graphiques
- **Framer Motion** + CSS animations
- **react-hot-toast** pour les notifications UI
- **Lucide React** pour les icônes
- **React Markdown** pour le chat Mɛsi

## Prérequis
- Node.js **v16+**
- npm **v8+**

## Installation & Lancement

```bash
# 1. Cloner / dézipper le projet
cd kplon-nu

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env

# 4. Lancer en développement
npm start
```

L'application sera disponible sur **http://localhost:3000**

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| 👩‍🎓 Étudiant | `fifame.legba@gmail.com` | `password123` |
| 👨‍🏫 Professeur | `koffi.ahouant@univ-benin.bj` | `password123` |

## Build pour production

```bash
npm run build
```

Les fichiers buildés seront dans le dossier `build/`.

## Structure du projet

```
src/
├── App.js                    # Routing principal
├── index.css                 # Design system global
├── contexts/
│   └── AuthContext.js        # Auth JWT (mock)
├── data/
│   └── mockData.js           # Données de démonstration
├── components/
│   ├── Sidebar.js            # Navigation latérale
│   └── Topbar.js             # Barre du haut
└── pages/
    ├── LoginPage.js
    ├── RegisterPage.js
    ├── StudentDashboard.js
    ├── ProfessorDashboard.js
    ├── CoursesPage.js
    ├── CourseDetailPage.js
    ├── AIAssistantPage.js    # Chat Mɛsi
    ├── FlashcardsPage.js
    ├── QuizPage.js
    ├── ProgressPage.js
    ├── NotificationsPage.js
    ├── ProfilePage.js
    ├── CreateCoursePage.js
    ├── StudentsPage.js
    └── SettingsPage.js
```

## Connexion au backend (Express.js)

Actuellement, toutes les données sont mockées dans `src/data/mockData.js`.  
Pour connecter le backend, remplacez les imports de données par des appels `axios` :

```js
// Exemple dans CoursesPage.js
import axios from 'axios';
const res = await axios.get(`${process.env.REACT_APP_API_URL}/courses`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

## Pages implémentées

### Espace Étudiant
- ✅ Connexion / Inscription / Mot de passe oublié
- ✅ Tableau de bord (stats, streak, graphiques, accès rapide)
- ✅ Liste des cours (filtres, progression)
- ✅ Détail d'un cours (chapitres, ressources, Mɛsi)
- ✅ Assistant IA Mɛsi (chat, "Explique-moi autrement")
- ✅ Flashcards (révision, score)
- ✅ Quiz adaptatifs (correction + explication)
- ✅ Tableau de progression (graphiques détaillés)
- ✅ Notifications (marquer comme lues)
- ✅ Profil utilisateur
- ✅ Paramètres (notifications, hors-ligne, langue)

### Espace Professeur
- ✅ Tableau de bord professeur (stats, cours, graphiques)
- ✅ Gestion des étudiants (filtrages, alertes risque)
- ✅ Création de cours (chapitres, upload, indices TP)
- ✅ Vue cours (réutilise CoursesPage)
