const express = require('express');
const router = express.Router();
const { registerStudent, registerProfessor, login, googleCallback, completeProfile, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const passport = require('../config/passport');

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Inscription, connexion et gestion du profil
 */

/**
 * @swagger
 * /auth/register/student:
 *   post:
 *     summary: Inscrire un étudiant
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password, studyYear, studentId, majors]
 *             properties:
 *               firstName: { type: string, example: "Kodjo" }
 *               lastName: { type: string, example: "ABALO" }
 *               email: { type: string, example: "kodjo@example.com" }
 *               password: { type: string, example: "motdepasse123" }
 *               studyYear: { type: string, example: "Licence 2" }
 *               studentId: { type: string, example: "20304050" }
 *               majors: { type: array, items: { type: string }, example: ["Informatique"] }
 *     responses:
 *       201: { description: Étudiant créé avec succès }
 *       400: { description: Données invalides }
 *       409: { description: Email déjà utilisé }
 */
router.post('/register/student', registerStudent);

/**
 * @swagger
 * /auth/register/professor:
 *   post:
 *     summary: Inscrire un professeur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password, expertiseField]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               expertiseField: { type: string, example: "Mathématiques" }
 *     responses:
 *       201: { description: Professeur créé avec succès }
 */
router.post('/register/professor', registerProfessor);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion avec email et mot de passe
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Connexion réussie, retourne un JWT }
 *       401: { description: Identifiants incorrects }
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initier la connexion via Google OAuth
 *     tags: [Authentification]
 *     responses:
 *       302: { description: Redirection vers Google }
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Callback Google OAuth (appelé automatiquement par Google)
 *     tags: [Authentification]
 *     responses:
 *       302: { description: Redirection vers le frontend avec token }
 */
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth` }),
    googleCallback
);

/**
 * @swagger
 * /auth/complete-profile:
 *   put:
 *     summary: Compléter le profil (après connexion OAuth)
 *     tags: [Authentification]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Profil complété }
 */
router.put('/complete-profile', protect, completeProfile);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtenir le profil de l'utilisateur connecté
 *     tags: [Authentification]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Données de l'utilisateur connecté }
 */
router.get('/me', protect, getMe);

const { uploadImage } = require('../config/cloudinary');
const { updateProfile } = require('../controllers/auth.controller');

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Mettre à jour le profil (incluant l'avatar)
 *     tags: [Authentification]
 *     security: [{ BearerAuth: [] }]
 */
router.put('/profile', protect, uploadImage.single('avatar'), updateProfile);


module.exports = router;
