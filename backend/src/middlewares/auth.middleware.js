const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

/**
 * @description Protège une route : vérifie le JWT et charge l'utilisateur dans req.user
 */
exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Accès refusé. Veuillez vous connecter.',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur introuvable. Token invalide.',
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Token invalide ou expiré.',
        });
    }
};

/**
 * @description Vérifie que l'utilisateur a un profil complet (post-OAuth)
 */
exports.requireCompleteProfile = (req, res, next) => {
    if (!req.user.isProfileComplete) {
        return res.status(403).json({
            success: false,
            message: 'Veuillez compléter votre profil avant de continuer.',
            redirect: '/complete-profile',
        });
    }
    next();
};

/**
 * @description Restreint l'accès selon le rôle
 * @param  {...string} roles - Rôles autorisés ('STUDENT', 'PROFESSOR', 'ADMIN')
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Le rôle '${req.user?.role || 'inconnu'}' n'est pas autorisé à effectuer cette action.`,
            });
        }
        next();
    };
};

/**
 * @description Facultatif : identifie l'utilisateur sans bloquer les visiteurs
 */
exports.optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
        }
    } catch {
        req.user = null;
    }
    next();
};
