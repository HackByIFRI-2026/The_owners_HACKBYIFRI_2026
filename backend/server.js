require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { resetBotQuota } = require('./src/utils/cron.utils');

// ================================================
// Connexion à la base de données
// ================================================
connectDB();

// ================================================
// Serveur HTTP
// ================================================
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`\n🚀 Serveur Kplɔ́n nǔ lancé en mode ${process.env.NODE_ENV} sur le port ${PORT}`);
    console.log(`📖 Documentation API: http://localhost:${PORT}/api/v1/docs`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/api/v1/health\n`);

    // Démarrer le cron job
    resetBotQuota.start();
    console.log(`⏰ Cron Job "Réinitialisation quota Bot" démarré.`);
});

// ================================================
// Gestion des erreurs non capturées
// ================================================
process.on('unhandledRejection', (err) => {
    console.error(`\n💥 UnhandledRejection: ${err.message}`);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.error(`\n💥 UncaughtException: ${err.message}`);
    process.exit(1);
});
