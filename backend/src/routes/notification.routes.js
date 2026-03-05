const express = require('express');
const router = express.Router();
const { getMyNotifications, markAllAsRead, markAsRead } = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect); // Toutes les routes de notification nécessitent d'être connecté

router.get('/', getMyNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

module.exports = router;
