const express = require('express');
const router = express.Router();
const { askQuestion, generateFlashcards } = require('../controllers/bot.controller');
const { protect, authorize, requireCompleteProfile } = require('../middlewares/auth.middleware');
const { checkBotQuestionLimit } = require('../middlewares/plan.middleware');

/**
 * @swagger
 * tags:
 *   name: Bot Mɛsi
 *   description: Assistant IA pédagogique
 */

/**
 * @swagger
 * /bot/ask:
 *   post:
 *     summary: Poser une question à Mɛsi (20/jour en FREE, illimité PREMIUM)
 *     tags: [Bot Mɛsi]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [question]
 *             properties:
 *               question: { type: string, example: "Qu'est-ce qu'une variable en programmation ?" }
 *               courseContext: { type: string, description: "Texte du cours pour contexte" }
 *     responses:
 *       200: { description: Réponse de Mɛsi }
 *       403: { description: Limite journalière atteinte }
 */
router.post('/ask', protect, requireCompleteProfile, authorize('STUDENT'), checkBotQuestionLimit, askQuestion);

/**
 * @swagger
 * /bot/flashcards:
 *   post:
 *     summary: Générer des flashcards à partir du contenu d'un cours
 *     tags: [Bot Mɛsi]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseContent]
 *             properties:
 *               courseContent: { type: string }
 *               numberOfCards: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Tableau de flashcards }
 */
router.post('/flashcards', protect, requireCompleteProfile, authorize('STUDENT'), generateFlashcards);

module.exports = router;
