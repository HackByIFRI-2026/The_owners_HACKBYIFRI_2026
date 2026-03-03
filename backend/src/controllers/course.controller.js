const Course = require('../models/Course.model');
const Classroom = require('../models/Classroom.model');
const { cloudinary } = require('../config/cloudinary');

/**
 * @desc    Publier un cours (texte ou PDF)
 * @route   POST /api/v1/classrooms/:classroomId/courses
 * @access  Private/Professor
 */
exports.createCourse = async (req, res, next) => {
    try {
        const { title, description, type, textContent } = req.body;

        if (!title || !type) {
            return res.status(400).json({ success: false, message: 'Titre et type requis.' });
        }

        const classroom = await Classroom.findById(req.params.classroomId);
        if (!classroom) return res.status(404).json({ success: false, message: 'Salle introuvable.' });
        if (classroom.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Accès refusé.' });
        }

        const courseData = { title, description, type, classroom: classroom._id, author: req.user._id };

        if (type === 'TEXT') {
            if (!textContent) return res.status(400).json({ success: false, message: 'Le contenu texte est requis.' });
            courseData.textContent = textContent;
        }

        if (type === 'PDF') {
            if (!req.file) return res.status(400).json({ success: false, message: 'Un fichier PDF est requis.' });
            courseData.fileUrl = req.file.path;
            courseData.filePublicId = req.file.filename;
            courseData.fileName = req.file.originalname;
        }

        const course = await Course.create(courseData);
        res.status(201).json({ success: true, data: course });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Obtenir tous les cours d'une salle
 * @route   GET /api/v1/classrooms/:classroomId/courses
 * @access  Private (prof ou étudiant accepté)
 */
exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({ classroom: req.params.classroomId })
            .sort({ createdAt: -1 })
            .populate('author', 'firstName lastName');

        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Supprimer un cours
 * @route   DELETE /api/v1/courses/:id
 * @access  Private/Professor
 */
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: 'Cours introuvable.' });
        if (course.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Action non autorisée.' });
        }

        if (course.filePublicId) {
            await cloudinary.uploader.destroy(course.filePublicId, { resource_type: 'raw' });
        }

        await course.deleteOne();
        res.status(200).json({ success: true, message: 'Cours supprimé.' });
    } catch (err) {
        next(err);
    }
};
