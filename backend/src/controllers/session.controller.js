const Session = require('../models/Session.model');
const Classroom = require('../models/Classroom.model');

/**
 * @desc    Créer une session de visioconférence
 * @route   POST /api/v1/classrooms/:classroomId/sessions
 * @access  Private/Professor
 */
exports.createSession = async (req, res, next) => {
    try {
        const { title, scheduledStart, scheduledEnd, lateThresholdMinutes } = req.body;

        if (!title || !scheduledStart || !scheduledEnd) {
            return res.status(400).json({ success: false, message: 'Titre, date de début et de fin requis.' });
        }

        const classroom = await Classroom.findById(req.params.classroomId);
        if (!classroom) return res.status(404).json({ success: false, message: 'Salle introuvable.' });
        if (classroom.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Accès refusé.' });
        }

        const session = await Session.create({
            title,
            scheduledStart,
            scheduledEnd,
            lateThresholdMinutes: lateThresholdMinutes || 15,
            classroom: classroom._id,
            professor: req.user._id,
        });

        res.status(201).json({ success: true, data: session });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Lister les sessions d'une salle
 * @route   GET /api/v1/classrooms/:classroomId/sessions
 * @access  Private
 */
exports.getSessions = async (req, res, next) => {
    try {
        const sessions = await Session.find({ classroom: req.params.classroomId })
            .sort({ scheduledStart: 1 })
            .populate('professor', 'firstName lastName avatar');

        res.status(200).json({ success: true, count: sessions.length, data: sessions });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Rejoindre une session (calcule et enregistre la présence)
 * @route   POST /api/v1/sessions/:id/join
 * @access  Private/Student
 */
exports.joinSession = async (req, res, next) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ success: false, message: 'Session introuvable.' });

        if (session.status === 'ENDED') {
            return res.status(400).json({ success: false, message: 'La session est déjà terminée.' });
        }

        const now = new Date();
        const start = new Date(session.scheduledStart);
        const lateThreshold = new Date(start.getTime() + session.lateThresholdMinutes * 60 * 1000);

        // Calculer le statut de présence
        let status = 'PRESENT';
        if (now > lateThreshold) status = 'LATE';
        if (session.status === 'SCHEDULED') status = 'ABSENT'; // Session pas encore démarrée

        // Éviter les doublons
        const alreadyRecorded = session.attendance.find(
            (a) => a.student.toString() === req.user._id.toString()
        );

        if (!alreadyRecorded) {
            session.attendance.push({
                student: req.user._id,
                status,
                joinedAt: now,
            });
            await session.save();
        }

        res.status(200).json({
            success: true,
            message: `Vous avez rejoint la session avec le statut: ${status}`,
            status,
            roomId: session.roomId,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Démarrer une session (status LIVE)
 * @route   PUT /api/v1/sessions/:id/start
 * @access  Private/Professor
 */
exports.startSession = async (req, res, next) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ success: false, message: 'Session introuvable.' });
        if (session.professor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Accès refusé.' });
        }

        session.status = 'LIVE';
        await session.save();

        res.status(200).json({ success: true, data: { roomId: session.roomId, status: session.status } });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Terminer une session (status ENDED)
 * @route   PUT /api/v1/sessions/:id/end
 * @access  Private/Professor
 */
exports.endSession = async (req, res, next) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ success: false, message: 'Session introuvable.' });
        if (session.professor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Accès refusé.' });
        }

        session.status = 'ENDED';
        await session.save();

        res.status(200).json({ success: true, message: 'Session terminée.', data: session });
    } catch (err) {
        next(err);
    }
};
