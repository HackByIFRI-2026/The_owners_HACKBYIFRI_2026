const express = require('express');
const router = express.Router();
const { getRandomQuiz, createQuiz } = require('../controllers/quiz.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/random', protect, getRandomQuiz);
router.post('/', protect, authorize('PROFESSOR', 'ADMIN'), createQuiz);

module.exports = router;
