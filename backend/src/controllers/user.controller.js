const Classroom = require('../models/Classroom.model');
const User = require('../models/User.model');

/**
 * @desc    Obtenir les statistiques de l'utilisateur connecté
 * @route   GET /api/v1/users/me/stats
 * @access  Private
 */
exports.getMyStats = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // 1. Salles actives (étudiant)
        const activeClassrooms = await Classroom.countDocuments({
            'students.student': userId,
            'students.status': 'ACCEPTED'
        });

        // 2. Next Session (Prochain cours live)
        // Pour la MVP on cherche la première salle où il est accepté
        const firstClassroom = await Classroom.findOne({
            'students.student': userId,
            'students.status': 'ACCEPTED'
        });

        // Simuler des statistiques basées sur l'ID de l'utilisateur pour la cohérence
        const seed = parseInt(userId.toString().slice(-4), 16);

        const stats = {
            activeClassrooms: activeClassrooms || seed % 5,
            streak: (seed % 14) + 1, // 1 to 14 days
            quizAvg: 60 + (seed % 35), // 60 to 95%
            flashcards: (seed % 200) + 20,
            sessionsTotal: (seed % 60) + 10,
            quizPassed: (seed % 20) + 5
        };

        const nextSession = firstClassroom ? {
            name: firstClassroom.subject || firstClassroom.name,
            date: 'Dans 2 jours, 14h00',
            isLive: true
        } : {
            name: 'Aucun cours prévu',
            date: '-',
            isLive: false
        };

        const activityLog = [
            { day: 'Lun', points: (seed % 40) + 10 },
            { day: 'Mar', points: (seed % 50) + 20 },
            { day: 'Mer', points: (seed % 30) + 10 },
            { day: 'Jeu', points: (seed % 60) + 20 },
            { day: 'Ven', points: (seed % 45) + 15 },
            { day: 'Sam', points: (seed % 20) + 5 },
            { day: 'Dim', points: (seed % 15) }
        ];

        const skills = [
            { subject: 'Algorithmique', A: 90 + (seed % 40), fullMark: 150 },
            { subject: 'Bases de Données', A: 80 + (seed % 50), fullMark: 150 },
            { subject: 'Dev Web', A: 100 + (seed % 30), fullMark: 150 },
            { subject: 'Réseaux', A: 70 + (seed % 60), fullMark: 150 },
            { subject: 'IA', A: 60 + (seed % 70), fullMark: 150 },
            { subject: 'Mathématiques', A: 85 + (seed % 45), fullMark: 150 }
        ];

        res.status(200).json({
            success: true,
            data: {
                stats,
                nextSession,
                activityLog,
                skills
            }
        });
    } catch (err) {
        next(err);
    }
};
