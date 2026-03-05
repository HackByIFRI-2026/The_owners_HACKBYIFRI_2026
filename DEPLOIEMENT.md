# Guide de Déploiement : Kplɔ́n nǔ

Ce guide explique comment déployer la plateforme Kplɔ́n nǔ (Frontend + Backend) en production sur un VPS (ex: Hostinger, DigitalOcean, AWS) ou des services PaaS.

## 1. Prérequis Serveur
- **Node.js** (v18 ou supérieur) recommandation de l'utiliser via NVM.
- **MongoDB** (Cloud via MongoDB Atlas ou instance locale)
- **Git** pour récupérer le code
- **Nginx** (Recommandé pour le reverse proxy)
- **PM2** (`npm install -g pm2`) pour maintenir le backend en vie en arrière-plan.

## 2. Déploiement du Backend (Node.js / Express)

1. **Cloner le projet** sur votre serveur et accéder au dossier `backend`.
2. **Installer les dépendances** :
   ```bash
   npm install
   ```
3. **Configurer l'environnement** :
   Créer un fichier `.env` à la racine de `backend` avec vos vraies clés de production :
   ```env
   PORT=5002
   NODE_ENV=production
   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/kplon_nu
   JWT_SECRET=votre_super_secret_complexe
   FRONTEND_URL=https://votre-domaine.com
   GEMINI_API_KEY=votre_cle_gemini
   ```
   *(Note : Assurez-vous que le dossier `/Files` se trouve au niveau racine commun, il se créera automatiquement si les droits d'écriture sont accordés)*
4. **Démarrer avec PM2** :
   ```bash
   pm2 start server.js --name "kplon-nu-backend"
   pm2 save
   pm2 startup
   ```
   L'API tournera en continu et se relancera au démarrage de la machine.

## 3. Déploiement du Frontend (React / Vite)

Deux options s'offrent à vous :

### Option A : Déploiement Statique sur Vercel / Netlify (Rapide)
1. Pousser séparément le dossier `frontend` sur GitHub (ou y faire pointer Vercel).
2. Vérifier que la variable `baseURL` dans `frontend/src/services/api.js` pointe bien vers votre vraie URL backend en production (ex: `https://api.votre-domaine.com/api/v1`).
3. Configurer le *Build Command* à `npm run build` et le *Output Directory* à `dist`.

### Option B : Déploiement sur le même VPS avec Nginx (Autonome)
1. **Générer le build de production** :
   Dans le dossier `frontend`, mettez à jour `api.js` puis exécutez :
   ```bash
   npm install
   npm run build
   ```
   Un dossier `dist` sera généré, contenant le frontend optimisé.
2. **Configurer Nginx** pour servir le frontend et lier l'API :
   Créez un profil pour votre site dans `/etc/nginx/sites-available/kplon-nu` :
   ```nginx
   server {
       listen 80;
       server_name votre-domaine.com;

       # Servir l'application Frontend React
       location / {
           root /chemin/vers/votre/dossier/frontend/dist;
           index index.html;
           try_files $uri $uri/ /index.html;
       }

       # Reverse Proxy vers le Backend
       location /api/v1/ {
           proxy_pass http://localhost:5002/api/v1/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }

       # Autoriser l'accès direct aux fichiers médias locaux
       location /Files/ {
           proxy_pass http://localhost:5002/Files/;
           proxy_set_header Host $host;
       }
   }
   ```
3. Activer la configuration et redémarrer Nginx :
   ```bash
   sudo ln -s /etc/nginx/sites-available/kplon-nu /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

## 4. Sécurisation (HTTPS)
Exécutez **Certbot** pour obtenir un certificat SSL gratuit et chiffrer vos requêtes de bout en bout :
```bash
sudo certbot --nginx -d votre-domaine.com
```

**Bravo, la plateforme Kplɔ́n nǔ est en ligne, sécurisée et prête à accueillir des milliers d'étudiants !**
