const Quiz = require('../models/Quiz.model');

/**
 * @desc    Obtenir un quiz aléatoire ou par tag
 * @route   GET /api/v1/quizzes/random
 * @access  Private
 */
exports.getRandomQuiz = async (req, res, next) => {
    try {
        const { tag } = req.query;
        let query = {};
        if (tag) {
            query.tags = tag;
        }

        const count = await Quiz.countDocuments(query);
        if (count === 0) {
            return res.status(404).json({ success: false, message: 'Aucun quiz disponible pour le moment.' });
        }

        const random = Math.floor(Math.random() * count);
        const quiz = await Quiz.findOne(query).skip(random);

        res.status(200).json({ success: true, data: quiz });

    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Créer un nouveau quiz (Admin / Professeur)
 * @route   POST /api/v1/quizzes
 * @access  Private
 */
exports.createQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.create(req.body);
        res.status(201).json({ success: true, data: quiz });
    } catch (err) {
        next(err);
    }
};
