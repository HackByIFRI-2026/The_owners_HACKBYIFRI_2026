const User = require('../models/User.model');
const { generateToken } = require('../utils/jwt.utils');
const joi = require('joi');

// ======================== Validation Schemas ========================

const registerStudentSchema = joi.object({
    firstName: joi.string().trim().required(),
    lastName: joi.string().trim().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    studyYear: joi.string().required(),
    studentId: joi.string().required(),
    majors: joi.array().items(joi.string()).min(1).required(),
});

const registerProfessorSchema = joi.object({
    firstName: joi.string().trim().required(),
    lastName: joi.string().trim().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    expertiseField: joi.string().trim().required(),
});

// ======================== Controllers ========================

/**
 * @desc    Inscription d'un étudiant
 * @route   POST /api/v1/auth/register/student
 * @access  Public
 */
exports.registerStudent = async (req, res, next) => {
    try {
        const { error } = registerStudentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const { firstName, lastName, email, password, studyYear, studentId, majors } = req.body;
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: 'Un compte avec cet email existe déjà.' });
        }

        const student = await User.create({
            role: 'STUDENT',
            firstName,
            lastName,
            email,
            password,
            studyYear,
            studentId,
            majors,
            isProfileComplete: true,
        });

        const token = generateToken(student._id);
        const userObj = student.toObject();
        delete userObj.password;

        res.status(201).json({ success: true, token, data: userObj });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Inscription d'un professeur
 * @route   POST /api/v1/auth/register/professor
 * @access  Public
 */
exports.registerProfessor = async (req, res, next) => {
    try {
        const { error } = registerProfessorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const { firstName, lastName, email, password, expertiseField } = req.body;

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: 'Un compte avec cet email existe déjà.' });
        }

        const professor = await User.create({
            role: 'PROFESSOR',
            firstName,
            lastName,
            email,
            password,
            expertiseField,
            isProfileComplete: true,
        });

        const token = generateToken(professor._id);
        const userObj = professor.toObject();
        delete userObj.password;

        res.status(201).json({ success: true, token, data: userObj });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Connexion (email + password)
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email et mot de passe requis.' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
        }

        const token = generateToken(user._id);
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ success: true, token, data: userObj });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Callback OAuth Google — redirige vers le frontend avec token
 * @route   GET /api/v1/auth/google/callback
 * @access  Public (appelé par Google)
 */
exports.googleCallback = (req, res) => {
    const token = generateToken(req.user._id);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (!req.user.isProfileComplete) {
        return res.redirect(`${frontendUrl}/complete-profile?token=${token}`);
    }
    return res.redirect(`${frontendUrl}/dashboard?token=${token}`);
};

/**
 * @desc    Compléter le profil (après OAuth)
 * @route   PUT /api/v1/auth/complete-profile
 * @access  Private
 */
exports.completeProfile = async (req, res, next) => {
    try {
        const { role, studyYear, studentId, majors, expertiseField } = req.body;
        const user = req.user;

        if (!role || !['STUDENT', 'PROFESSOR'].includes(role)) {
            return res.status(400).json({ success: false, message: "Le rôle doit être 'STUDENT' ou 'PROFESSOR'." });
        }

        user.role = role;

        if (role === 'STUDENT') {
            if (!studyYear || !studentId || !majors) {
                return res.status(400).json({ success: false, message: 'Année d\'étude, matricule et filière(s) sont requis pour les étudiants.' });
            }
            user.studyYear = studyYear;
            user.studentId = studentId;
            user.majors = majors;
        }

        if (role === 'PROFESSOR') {
            if (!expertiseField) {
                return res.status(400).json({ success: false, message: 'Le domaine de compétence est requis pour les professeurs.' });
            }
            user.expertiseField = expertiseField;
        }

        user.isProfileComplete = true;
        await user.save();

        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ success: true, message: 'Profil complété avec succès.', data: userObj });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Récupérer le profil de l'utilisateur connecté
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
    res.status(200).json({ success: true, data: req.user });
};

/**
 * @desc    Mettre à jour le profil (avatar, infos de base)
 * @route   PUT /api/v1/auth/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
    try {
        console.log('--- UPDATE PROFILE DEBUG ---');
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);
        console.log('----------------------------');

        const { firstName, lastName, email } = req.body;
        const updateData = {};

        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (email) updateData.email = email;

        // If an image was uploaded via Cloudinary multer
        if (req.file) {
            updateData.avatar = req.file.path;
        }

        const user = await User.findByIdAndUpdate(req.user._id, updateData, {
            new: true,
            runValidators: true,
        }).select('-password');

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};
