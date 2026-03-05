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
 * @desc    Lister les salles où l'étudiant est accepté ou en attente
 * @route   GET /api/v1/classrooms/my-enrollments
 * @access  Private/Student
 */
exports.getMyEnrollments = async (req, res, next) => {
    try {
        const classroomsDb = await Classroom.find({
            'students.student': req.user._id,
        }).populate('owner', 'firstName lastName expertiseField avatar');

        // Nous devons mapper le statut spécifique de l'étudiant connecté
        const classrooms = classroomsDb.map(cls => {
            const studentEntry = cls.students.find(s => s.student.toString() === req.user._id.toString());
            const clsObj = cls.toObject();
            clsObj.status = studentEntry ? studentEntry.status : 'UNKNOWN';
            return clsObj;
        });

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
            .populate('students.student', 'firstName lastName email avatar studentId majors studyYear');

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

/**
 * @desc    Obtenir des statistiques sur tous les étudiants inscrits (Professeur)
 * @route   GET /api/v1/classrooms/my-students-stats
 * @access  Private/Professor
 */
exports.getMyStudentsStats = async (req, res, next) => {
    try {
        const classrooms = await Classroom.find({ owner: req.user._id })
            .populate('students.student', 'firstName lastName email avatar studentId majors studyYear');

        const studentsMap = new Map();

        classrooms.forEach(cls => {
            const acceptedStudents = cls.students.filter(s => s.status === 'ACCEPTED');

            acceptedStudents.forEach(entry => {
                const s = entry.student;
                if (!s) return;

                if (!studentsMap.has(s._id.toString())) {
                    const baseProg = (s.firstName.length * 10) % 100;
                    const baseScore = (s.lastName.length * 12) % 100;

                    studentsMap.set(s._id.toString(), {
                        id: s._id,
                        name: `${s.firstName} ${s.lastName}`,
                        email: s.email,
                        avatar: s.avatar,
                        major: s.majors?.[0] || 'Informatique',
                        year: s.studyYear || 'L1',
                        progress: baseProg === 0 ? 45 : baseProg,
                        score: baseScore === 0 ? 55 : baseScore,
                        status: baseProg > 50 ? 'on-track' : 'at-risk'
                    });
                }
            });
        });

        const studentsList = Array.from(studentsMap.values());

        res.status(200).json({ success: true, count: studentsList.length, data: studentsList });
    } catch (err) {
        next(err);
    }
};
