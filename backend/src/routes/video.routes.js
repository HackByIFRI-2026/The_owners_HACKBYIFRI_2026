const express = require('express');
const router = express.Router();
const {
    getAllVideos, getVideoById, createVideo, deleteVideo,
    reactToVideo, addComment, replyToComment,
} = require('../controllers/video.controller');
const { protect, authorize, optionalAuth } = require('../middlewares/auth.middleware');
const { uploadVideo } = require('../config/cloudinary');

/**
 * @swagger
 * tags:
 *   name: Vidéos
 *   description: Vidéos publiques des professeurs
 */

/**
 * @swagger
 * /videos:
 *   get:
 *     summary: Lister toutes les vidéos (public, avec pagination)
 *     tags: [Vidéos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *     responses:
 *       200: { description: Liste des vidéos }
 */
router.get('/', optionalAuth, getAllVideos);

/**
 * @swagger
 * /videos/{id}:
 *   get:
 *     summary: Obtenir une vidéo (incrémente les vues)
 *     tags: [Vidéos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Données de la vidéo }
 *       404: { description: Vidéo introuvable }
 */
router.get('/:id', optionalAuth, getVideoById);

/**
 * @swagger
 * /videos:
 *   post:
 *     summary: Publier une vidéo (Professeur uniquement)
 *     tags: [Vidéos]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, video]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               commentsEnabled: { type: boolean }
 *               video: { type: string, format: binary }
 *     responses:
 *       201: { description: Vidéo publiée }
 */
router.post('/', protect, authorize('PROFESSOR'), uploadVideo.single('video'), createVideo);

/**
 * @swagger
 * /videos/{id}:
 *   delete:
 *     summary: Supprimer une vidéo (propriétaire uniquement)
 *     tags: [Vidéos]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Vidéo supprimée }
 */
router.delete('/:id', protect, authorize('PROFESSOR'), deleteVideo);

/**
 * @swagger
 * /videos/{id}/react:
 *   post:
 *     summary: Liker ou disliker une vidéo
 *     tags: [Vidéos]
 *     security: [{ BearerAuth: [] }]
 */
router.post('/:id/react', protect, reactToVideo);

/**
 * @swagger
 * /videos/{id}/comments:
 *   post:
 *     summary: Ajouter un commentaire
 *     tags: [Vidéos]
 *     security: [{ BearerAuth: [] }]
 */
router.post('/:id/comments', protect, addComment);

/**
 * @swagger
 * /videos/{id}/comments/{commentId}/replies:
 *   post:
 *     summary: Répondre à un commentaire
 *     tags: [Vidéos]
 *     security: [{ BearerAuth: [] }]
 */
router.post('/:id/comments/:commentId/replies', protect, replyToComment);

module.exports = router;
