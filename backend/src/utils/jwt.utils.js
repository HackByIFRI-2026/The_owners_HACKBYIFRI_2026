const jwt = require('jsonwebtoken');

/**
 * Génère un JWT pour un utilisateur donné
 * @param {string} userId - L'ID MongoDB de l'utilisateur
 * @returns {string} Le token JWT signé
 */
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

module.exports = { generateToken };
