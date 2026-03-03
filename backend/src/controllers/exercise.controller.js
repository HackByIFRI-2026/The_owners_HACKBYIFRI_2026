const Exercise = require('../models/Exercise.model');
const Submission = require('../models/Submission.model');
const Classroom = require('../models/Classroom.model');
const { cloudinary } = require('../config/cloudinary');

// ==========================
// Exercices
// ==========================

/**
 * @desc    Créer un exercice ou TP
 * @route   POST /api/v1/classrooms/:classroomId/exercises
 * @access  Private/Professor
 */
exports.createExercise = async (req, res, next) => {
    try {
        const { title, instructions, type, dueDate } = req.body;

        if (!title || !instructions || !type) {
            return res.status(400).json({ success: false, message: 'Titre, instructions et type requis.' });
        }

        const classroom = await Classroom.findById(req.params.classroomId);
        if (!classroom) return res.status(404).json({ success: false, message: 'Salle introuvable.' });
        if (classroom.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Accès refusé.' });
        }

        const exercise = await Exercise.create({
            title, instructions, type, dueDate,
            classroom: classroom._id,
            author: req.user._id,
            attachmentUrl: req.file ? req.file.path : null,
        });

        res.status(201).json({ success: true, data: exercise });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Lister les exercices d'une salle
 * @route   GET /api/v1/classrooms/:classroomId/exercises
 * @access  Private
 */
exports.getExercises = async (req, res, next) => {
    try {
        const exercises = await Exercise.find({ classroom: req.params.classroomId })
            .sort({ createdAt: -1 })
            .populate('author', 'firstName lastName');

        res.status(200).json({ success: true, count: exercises.length, data: exercises });
    } catch (err) {
        next(err);
    }
};

// ==========================
// Soumissions
// ==========================

/**
 * @desc    Soumettre un exercice/TP (fichier ZIP ou lien)
 * @route   POST /api/v1/exercises/:exerciseId/submit
 * @access  Private/Student
 */
exports.submitExercise = async (req, res, next) => {
    try {
        const { linkUrl, linkType } = req.body;
        const exerciseId = req.params.exerciseId;

        if (!req.file && !linkUrl) {
            return res.status(400).json({ success: false, message: 'Un fichier ZIP ou un lien est requis.' });
        }

        // Vérifier qu'il n'y a pas déjà une soumission pour cet exercice
        const existing = await Submission.findOne({ exercise: exerciseId, student: req.user._id });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Vous avez déjà soumis cet exercice.' });
        }

        const submission = await Submission.create({
            exercise: exerciseId,
            student: req.user._id,
            fileUrl: req.file ? req.file.path : null,
            filePublicId: req.file ? req.file.filename : null,
            linkUrl: linkUrl || null,
            linkType: linkType || null,
        });

        res.status(201).json({ success: true, data: submission });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Lister toutes les soumissions d'un exercice (pour le prof)
 * @route   GET /api/v1/exercises/:exerciseId/submissions
 * @access  Private/Professor
 */
exports.getSubmissions = async (req, res, next) => {
    try {
        const submissions = await Submission.find({ exercise: req.params.exerciseId })
            .populate('student', 'firstName lastName studentId email');

        res.status(200).json({ success: true, count: submissions.length, data: submissions });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Corriger une soumission (note + feedback)
 * @route   PUT /api/v1/submissions/:id/grade
 * @access  Private/Professor
 */
exports.gradeSubmission = async (req, res, next) => {
    try {
        const { grade, feedbackText } = req.body;

        if (grade === undefined) {
            return res.status(400).json({ success: false, message: 'La note est requise.' });
        }

        const submission = await Submission.findById(req.params.id).populate('exercise');
        if (!submission) return res.status(404).json({ success: false, message: 'Soumission introuvable.' });

        submission.grade = grade;
        submission.feedbackText = feedbackText || null;
        submission.feedbackFileUrl = req.file ? req.file.path : null;
        submission.isGraded = true;
        submission.gradedAt = new Date();

        await submission.save();
        res.status(200).json({ success: true, data: submission });
    } catch (err) {
        next(err);
    }
};
