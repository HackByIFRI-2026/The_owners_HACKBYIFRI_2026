const express = require('express');
const router = express.Router();
const {
    createClassroom, getMyClassrooms, getMyEnrollments,
    getClassroomById, joinClassroom, validateStudents, getPendingStudents, getMyStudentsStats
} = require('../controllers/classroom.controller');
const { protect, authorize, requireCompleteProfile } = require('../middlewares/auth.middleware');
const { checkClassroomLimit } = require('../middlewares/plan.middleware');

/**
 * @swagger
 * tags:
 *   name: Salles de classe
 *   description: Gestion des salles de classe
 */

/**
 * @swagger
 * /classrooms:
 *   post:
 *     summary: Créer une salle de classe (Prof, max 10 en FREE)
 *     tags: [Salles de classe]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, subject]
 *             properties:
 *               name: { type: string }
 *               subject: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Salle créée }
 *       403: { description: Limite atteinte }
 */
router.post('/', protect, requireCompleteProfile, authorize('PROFESSOR'), checkClassroomLimit, createClassroom);

/**
 * @swagger
 * /classrooms/mine:
 *   get:
 *     summary: Lister mes salles (Professeur)
 *     tags: [Salles de classe]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Liste des salles }
 */
router.get('/mine', protect, authorize('PROFESSOR'), getMyClassrooms);

/**
 * @swagger
 * /classrooms/my-enrollments:
 *   get:
 *     summary: Lister les salles où je suis accepté (Étudiant)
 *     tags: [Salles de classe]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Liste des inscriptions }
 */
router.get('/my-enrollments', protect, authorize('STUDENT'), getMyEnrollments);

/**
 * @swagger
 * /classrooms/join:
 *   post:
 *     summary: Rejoindre une salle via code d'invitation
 *     tags: [Salles de classe]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [inviteCode]
 *             properties:
 *               inviteCode: { type: string, example: "ABC123" }
 *     responses:
 *       200: { description: Demande envoyée }
 */
router.post('/join', protect, requireCompleteProfile, authorize('STUDENT'), joinClassroom);

/**
 * @swagger
 * /classrooms/my-students-stats:
 *   get:
 *     summary: Obtenir les statistiques des étudiants de mes salles
 *     tags: [Salles de classe]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Liste des étudiants agrégés }
 */
router.get('/my-students-stats', protect, authorize('PROFESSOR'), getMyStudentsStats);

/**
 * @swagger
 * /classrooms/{id}:
 *   get:
 *     summary: Obtenir les détails d'une salle
 *     tags: [Salles de classe]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Détails de la salle }
 */
router.get('/:id', protect, requireCompleteProfile, getClassroomById);

/**
 * @swagger
 * /classrooms/{id}/validate:
 *   put:
 *     summary: Valider ou rejeter des étudiants (un ou plusieurs)
 *     tags: [Salles de classe]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [studentIds, action]
 *             properties:
 *               studentIds: { type: array, items: { type: string } }
 *               action: { type: string, enum: [ACCEPTED, REJECTED] }
 *     responses:
 *       200: { description: Mise à jour réussie }
 */
router.put('/:id/validate', protect, authorize('PROFESSOR'), validateStudents);

/**
 * @swagger
 * /classrooms/{id}/pending:
 *   get:
 *     summary: Lister les demandes d'accès en attente
 *     tags: [Salles de classe]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Liste des étudiants en attente }
 */
router.get('/:id/pending', protect, authorize('PROFESSOR'), getPendingStudents);

module.exports = router;
