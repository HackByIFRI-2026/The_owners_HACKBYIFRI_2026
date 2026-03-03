const Classroom = require('../models/Classroom.model');

/**
 * @desc    Créer une salle
 * @route   POST /api/v1/classrooms
 * @access  Private/Professor
 */
exports.createClassroom = async (req, res, next) => {
    try {
        const { name, subject, description } = req.body;

        if (!name || !subject) {
            return res.status(400).json({ success: false, message: 'Le nom et la matière sont requis.' });
        }

        const classroom = await Classroom.create({
            name,
            subject,
            description,
            owner: req.user._id,
        });

        res.status(201).json({ success: true, data: classroom });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Lister les salles du professeur connecté
 * @route   GET /api/v1/classrooms/mine
 * @access  Private/Professor
 */
exports.getMyClassrooms = async (req, res, next) => {
    try {
        const classrooms = await Classroom.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: classrooms.length, data: classrooms });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Lister les salles où l'étudiant est accepté
 * @route   GET /api/v1/classrooms/my-enrollments
 * @access  Private/Student
 */
exports.getMyEnrollments = async (req, res, next) => {
    try {
        const classrooms = await Classroom.find({
            'students.student': req.user._id,
            'students.status': 'ACCEPTED',
        }).populate('owner', 'firstName lastName expertiseField avatar');

        res.status(200).json({ success: true, count: classrooms.length, data: classrooms });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Obtenir une salle par ID
 * @route   GET /api/v1/classrooms/:id
 * @access  Private (propriétaire ou étudiant accepté)
 */
exports.getClassroomById = async (req, res, next) => {
    try {
        const classroom = await Classroom.findById(req.params.id)
            .populate('owner', 'firstName lastName avatar expertiseField')
            .populate('students.student', 'firstName lastName avatar studentId');

        if (!classroom) return res.status(404).json({ success: false, message: 'Salle introuvable.' });

        const isProfOwner = classroom.owner._id.toString() === req.user._id.toString();
        const isAcceptedStudent = classroom.students.some(
            (s) => s.student._id.toString() === req.user._id.toString() && s.status === 'ACCEPTED'
        );

        if (!isProfOwner && !isAcceptedStudent) {
            return res.status(403).json({ success: false, message: 'Accès refusé à cette salle.' });
        }

        res.status(200).json({ success: true, data: classroom });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Demander à rejoindre une salle (via code d'invitation)
 * @route   POST /api/v1/classrooms/join
 * @access  Private/Student
 */
exports.joinClassroom = async (req, res, next) => {
    try {
        const { inviteCode } = req.body;
        if (!inviteCode) return res.status(400).json({ success: false, message: 'Code d\'invitation requis.' });

        const classroom = await Classroom.findOne({ inviteCode });
        if (!classroom) return res.status(404).json({ success: false, message: 'Code d\'invitation invalide.' });

        const alreadyIn = classroom.students.some(
            (s) => s.student.toString() === req.user._id.toString()
        );
        if (alreadyIn) {
            return res.status(409).json({ success: false, message: 'Vous avez déjà envoyé une demande pour cette salle.' });
        }

        classroom.students.push({ student: req.user._id, status: 'PENDING' });
        await classroom.save();

        res.status(200).json({ success: true, message: 'Demande d\'accès envoyée. En attente de validation du professeur.' });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Valider les étudiants (un ou plusieurs)
 * @route   PUT /api/v1/classrooms/:id/validate
 * @access  Private/Professor
 */
exports.validateStudents = async (req, res, next) => {
    try {
        const { studentIds, action } = req.body; // action: 'ACCEPTED' | 'REJECTED'

        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({ success: false, message: 'Veuillez fournir un tableau de studentIds.' });
        }
        if (!['ACCEPTED', 'REJECTED'].includes(action)) {
            return res.status(400).json({ success: false, message: "L'action doit être 'ACCEPTED' ou 'REJECTED'." });
        }

        const classroom = await Classroom.findById(req.params.id);
        if (!classroom) return res.status(404).json({ success: false, message: 'Salle introuvable.' });
        if (classroom.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Vous n\'êtes pas le propriétaire de cette salle.' });
        }

        let updatedCount = 0;
        classroom.students.forEach((entry) => {
            if (studentIds.includes(entry.student.toString())) {
                entry.status = action;
                updatedCount++;
            }
        });

        await classroom.save();

        res.status(200).json({
            success: true,
            message: `${updatedCount} étudiant(s) mis à jour avec le statut '${action}'.`,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Lister les demandes en attente
 * @route   GET /api/v1/classrooms/:id/pending
 * @access  Private/Professor
 */
exports.getPendingStudents = async (req, res, next) => {
    try {
        const classroom = await Classroom.findById(req.params.id).populate(
            'students.student',
            'firstName lastName email avatar studentId majors studyYear'
        );

        if (!classroom) return res.status(404).json({ success: false, message: 'Salle introuvable.' });
        if (classroom.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Accès refusé.' });
        }

        const pending = classroom.students.filter((s) => s.status === 'PENDING');
        res.status(200).json({ success: true, count: pending.length, data: pending });
    } catch (err) {
        next(err);
    }
};
