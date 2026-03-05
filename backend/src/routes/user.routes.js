const express = require('express');
const router = express.Router();
const { getMyStats } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

/**
 * @swagger
 * /users/me/stats:
 *   get:
 *     summary: Obtenir les statistiques de progression de l'utilisateur
 *     tags: [Utilisateurs]
 *     security: [{ BearerAuth: [] }]
 */
router.get('/me/stats', getMyStats);

module.exports = router;
