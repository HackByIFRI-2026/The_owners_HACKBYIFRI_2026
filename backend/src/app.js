require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middlewares/error.middleware');

// Import Passport (to trigger configuration)
require('./config/passport');

const app = express();

// ================================================
// Sécurité
// ================================================
app.use(helmet({
    crossOriginResourcePolicy: false,
    frameguard: false,
    contentSecurityPolicy: false,
}));

// Rate Limiting global : 200 requêtes / 15 min par IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Trop de requêtes. Veuillez réessayer dans 15 minutes.' },
});
app.use('/api', limiter);

// ================================================
// CORS
// ================================================
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
    credentials: true,
}));

// ================================================
// Parsing
// ================================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ================================================
// Accès public aux fichiers uploadés (Dossier Files)
// ================================================
const path = require('path');
app.use('/Files', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    // console.log(`[FILES] Accès à : ${req.url}`);
    next();
}, express.static(path.join(__dirname, '../../Files')));

// ================================================
// Logging (dev uniquement)
// ================================================
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ================================================
// Documentation Swagger
// ================================================
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Kplɔ́n nǔ API Docs',
    customCss: '.swagger-ui .topbar { background-color: #1a1a2e; }',
}));

// ================================================
// Routes
// ================================================
const authRoutes = require('./routes/auth.routes');
const videoRoutes = require('./routes/video.routes');
const classroomRoutes = require('./routes/classroom.routes');
const courseRoutes = require('./routes/course.routes');
const exerciseRoutes = require('./routes/exercise.routes');
const sessionRoutes = require('./routes/session.routes');
const botRoutes = require('./routes/bot.routes');
const quizRoutes = require('./routes/quiz.routes');
const notificationRoutes = require('./routes/notification.routes');
const userRoutes = require('./routes/user.routes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/videos', videoRoutes);
app.use('/api/v1/classrooms', classroomRoutes);

// Routes imbriquées dans les salles de classe
app.use('/api/v1/classrooms/:classroomId/courses', courseRoutes);
app.use('/api/v1/classrooms/:classroomId/exercises', exerciseRoutes);
app.use('/api/v1/classrooms/:classroomId/sessions', sessionRoutes);

// Routes de sessions directes (pour start/end/join)
app.use('/api/v1/sessions', sessionRoutes);

app.use('/api/v1/bot', botRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/users', userRoutes);

// ================================================
// Route santé
// ================================================
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Kplɔ́n nǔ API est opérationnelle",
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

// ================================================
// Route 404
// ================================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route '${req.originalUrl}' introuvable.`,
    });
});

// ================================================
// Gestionnaire d'erreurs global (doit être en dernier)
// ================================================
app.use(errorHandler);

module.exports = app;
