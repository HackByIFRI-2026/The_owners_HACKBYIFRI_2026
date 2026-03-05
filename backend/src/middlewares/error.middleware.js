/**
 * @description Gestionnaire d'erreurs global Express.
 * À placer en dernier middleware dans app.js.
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log de l'erreur en développement
    if (process.env.NODE_ENV === 'development') {
        console.error('[ERROR] Error:', err);
        if (err.stack) console.error('[STACK] Stack:', err.stack);
    }

    // Mauvais ID Mongoose (CastError)
    if (err.name === 'CastError') {
        error.message = `Ressource introuvable avec l'ID: ${err.value}`;
        return res.status(404).json({ success: false, message: error.message });
    }

    // Violation de contrainte unique Mongoose (code 11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error.message = `La valeur du champ '${field}' est déjà utilisée.`;
        return res.status(400).json({ success: false, message: error.message });
    }

    // Erreur de validation Mongoose
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((val) => val.message);
        error.message = messages.join('. ');
        return res.status(400).json({ success: false, message: error.message });
    }

    // JWT expiré
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Session expirée. Veuillez vous reconnecter.' });
    }

    // JWT invalide
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Token invalide. Veuillez vous reconnecter.' });
    }

    // Erreur générique
    res.status(err.statusCode || 500).json({
        success: false,
        message: error.message || 'Erreur serveur interne.',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
