const cron = require('node-cron');
const User = require('../models/User.model');

/**
 * Tâche planifiée : Réinitialise le compteur de questions du Bot Mɛsi
 * pour tous les utilisateurs du plan FREE.
 * S'exécute tous les jours à minuit (00:00).
 */
const resetBotQuota = cron.schedule('0 0 * * *', async () => {
    try {
        const result = await User.updateMany(
            { plan: 'FREE', botQuestionsToday: { $gt: 0 } },
            { $set: { botQuestionsToday: 0 } }
        );
        console.log(`[CRON] [OK] Quota Bot Mɛsi réinitialisé pour ${result.modifiedCount} utilisateur(s).`);
    } catch (err) {
        console.error('[CRON] [FAIL] Erreur lors de la réinitialisation du quota bot:', err.message);
    }
}, {
    scheduled: false, // Sera démarré manuellement dans server.js
    timezone: 'Africa/Porto-Novo', // Fuseau horaire du Bénin
});

module.exports = { resetBotQuota };
