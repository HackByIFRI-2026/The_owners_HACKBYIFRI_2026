const Notification = require('../models/Notification.model');

/**
 * @desc    Obtenir toutes les notifications de l'utilisateur connecté
 * @route   GET /api/v1/notifications
 * @access  Private
 */
exports.getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort('-createdAt')
            .limit(50);

        res.status(200).json({ success: true, data: notifications });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Marquer toutes les notifications comme lues
 * @route   PUT /api/v1/notifications/read-all
 * @access  Private
 */
exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, read: false },
            { $set: { read: true } }
        );
        res.status(200).json({ success: true, message: 'Toutes les notifications ont été marquées comme lues' });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Marquer une notification comme lue
 * @route   PUT /api/v1/notifications/:id/read
 * @access  Private
 */
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { read: true },
            { new: true, runValidators: true }
        );
        if (!notification) return res.status(404).json({ success: false, message: 'Notification introuvable' });

        res.status(200).json({ success: true, data: notification });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    [INTERNE] Helper pour créer une notification
 */
exports.createNotification = async (recipientId, type, title, message, metadata = {}) => {
    try {
        return await Notification.create({
            recipient: recipientId,
            type,
            title,
            message,
            metadata
        });
    } catch (err) {
        console.error('Erreur lors de la création de notification:', err);
    }
};
