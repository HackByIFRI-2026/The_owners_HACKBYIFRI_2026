const express = require('express');
const router = express.Router({ mergeParams: true });
const { createCourse, getCourses, deleteCourse } = require('../controllers/course.controller');
const { protect, authorize, requireCompleteProfile } = require('../middlewares/auth.middleware');
const { uploadDocument } = require('../config/cloudinary');

/**
 * @swagger
 * tags:
 *   name: Cours
 *   description: Supports de cours (texte ou PDF)
 */

/**
 * @swagger
 * /classrooms/{classroomId}/courses:
 *   get:
 *     summary: Lister les cours d'une salle
 *     tags: [Cours]
 *     security: [{ BearerAuth: [] }]
 *   post:
 *     summary: Publier un cours (Professeur)
 *     tags: [Cours]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               type: { type: string, enum: [TEXT, PDF] }
 *               textContent: { type: string }
 *               file: { type: string, format: binary }
 */
router
    .route('/')
    .get(protect, requireCompleteProfile, getCourses)
    .post(protect, requireCompleteProfile, authorize('PROFESSOR'), uploadDocument.single('file'), createCourse);

router.delete('/:id', protect, authorize('PROFESSOR'), deleteCourse);

module.exports = router;
