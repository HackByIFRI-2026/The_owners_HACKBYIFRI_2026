const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    createExercise, getExercises,
    submitExercise, getSubmissions, gradeSubmission
} = require('../controllers/exercise.controller');
const { protect, authorize, requireCompleteProfile } = require('../middlewares/auth.middleware');
const { checkSubmissionLimit } = require('../middlewares/plan.middleware');
const { uploadSubmission, uploadDocument } = require('../config/cloudinary');

/**
 * @swagger
 * tags:
 *   name: Exercices & Soumissions
 *   description: Gestion des exercices, TPs et soumissions
 */

// --- Routes Exercices (via /classrooms/:classroomId/exercises) ---
router
    .route('/')
    .get(protect, requireCompleteProfile, getExercises)
    .post(protect, authorize('PROFESSOR'), uploadDocument.single('attachment'), createExercise);

// --- Soumission par un étudiant ---
router.post('/:exerciseId/submit',
    protect,
    requireCompleteProfile,
    authorize('STUDENT'),
    checkSubmissionLimit,
    uploadSubmission.single('file'),
    submitExercise
);

// --- Liste des soumissions (pour le prof) ---
router.get('/:exerciseId/submissions', protect, authorize('PROFESSOR'), getSubmissions);

// --- Corriger une soumission ---
router.put('/submissions/:id/grade', protect, authorize('PROFESSOR'), uploadDocument.single('feedbackFile'), gradeSubmission);

module.exports = router;
