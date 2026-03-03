const Classroom = require('../models/Classroom.model');
const Submission = require('../models/Submission.model');

const FREE_CLASSROOM_LIMIT = 10;
const FREE_SUBMISSION_LIMIT = 5;
const FREE_BOT_QUESTIONS_LIMIT = 20;

/**
 * @description Vérifie que le professeur FREE n'a pas atteint la limite de 10 salles
 */
exports.checkClassroomLimit = async (req, res, next) => {
    try {
        if (req.user.plan === 'PREMIUM') return next();

        const count = await Classroom.countDocuments({ owner: req.user._id });

        if (count >= FREE_CLASSROOM_LIMIT) {
            return res.status(403).json({
                success: false,
                message: `Limite atteinte. Le plan gratuit permet de créer au maximum ${FREE_CLASSROOM_LIMIT} salles. Passez en PREMIUM pour en créer davantage.`,
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Erreur lors de la vérification du quota.' });
    }
};

/**
 * @description Vérifie que l'étudiant FREE n'a pas atteint la limite de 5 soumissions
 */
exports.checkSubmissionLimit = async (req, res, next) => {
    try {
        if (req.user.plan === 'PREMIUM') return next();

        const count = await Submission.countDocuments({ student: req.user._id });

        if (count >= FREE_SUBMISSION_LIMIT) {
            return res.status(403).json({
                success: false,
                message: `Limite atteinte. Le plan gratuit permet de soumettre au maximum ${FREE_SUBMISSION_LIMIT} exercices/TPs. Passez en PREMIUM pour soumettre sans limite.`,
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Erreur lors de la vérification du quota.' });
    }
};

/**
 * @description Vérifie que l'étudiant FREE n'a pas dépassé 20 questions/jour au Bot Mɛsi
 */
exports.checkBotQuestionLimit = async (req, res, next) => {
    try {
        if (req.user.plan === 'PREMIUM') return next();

        // Réinitialisation automatique si la dernière question date d'un autre jour
        const today = new Date();
        const lastDate = req.user.lastBotQuestionDate;

        if (lastDate) {
            const isSameDay =
                lastDate.getFullYear() === today.getFullYear() &&
                lastDate.getMonth() === today.getMonth() &&
                lastDate.getDate() === today.getDate();

            if (!isSameDay) {
                // Réinitialiser pour aujourd'hui
                req.user.botQuestionsToday = 0;
                await req.user.save();
            }
        }

        if (req.user.botQuestionsToday >= FREE_BOT_QUESTIONS_LIMIT) {
            return res.status(403).json({
                success: false,
                message: `Vous avez atteint la limite de ${FREE_BOT_QUESTIONS_LIMIT} questions par jour pour le Bot Mɛsi. Revenez demain ou passez en PREMIUM.`,
                questionsUsed: req.user.botQuestionsToday,
                limit: FREE_BOT_QUESTIONS_LIMIT,
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Erreur lors de la vérification du quota.' });
    }
};
