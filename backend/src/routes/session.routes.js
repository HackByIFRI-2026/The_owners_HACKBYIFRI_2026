const express = require('express');
const router = express.Router({ mergeParams: true });
const { createSession, getSessions, joinSession, startSession, endSession } = require('../controllers/session.controller');
const { protect, authorize, requireCompleteProfile } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Sessions Live
 *   description: Visioconférences et gestion des présences
 */

/**
 * @swagger
 * /classrooms/{classroomId}/sessions:
 *   get:
 *     summary: Lister les sessions d'une salle
 *     tags: [Sessions Live]
 *     security: [{ BearerAuth: [] }]
 *   post:
 *     summary: Créer une session (Professeur)
 *     tags: [Sessions Live]
 *     security: [{ BearerAuth: [] }]
 */
router.route('/').get(protect, getSessions).post(protect, authorize('PROFESSOR'), createSession);

/**
 * @swagger
 * /sessions/{id}/join:
 *   post:
 *     summary: Rejoindre une session (enregistre la présence)
 *     tags: [Sessions Live]
 *     security: [{ BearerAuth: [] }]
 */
router.post('/:id/join', protect, requireCompleteProfile, authorize('STUDENT'), joinSession);

/**
 * @swagger
 * /sessions/{id}/start:
 *   put:
 *     summary: Démarrer une session
 *     tags: [Sessions Live]
 *     security: [{ BearerAuth: [] }]
 */
router.put('/:id/start', protect, authorize('PROFESSOR'), startSession);

/**
 * @swagger
 * /sessions/{id}/end:
 *   put:
 *     summary: Terminer une session
 *     tags: [Sessions Live]
 *     security: [{ BearerAuth: [] }]
 */
router.put('/:id/end', protect, authorize('PROFESSOR'), endSession);

module.exports = router;
