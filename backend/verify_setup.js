require('dotenv').config();
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cloudinary = require('cloudinary').v2;

async function verify() {
    console.log('--- Verification du Backend Kplɔ́n nǔ ---');

    // 1. Database
    try {
        console.log('1. Connexion à MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connecté.');
    } catch (err) {
        console.error('❌ MongoDB Erreur:', err.message);
    }

    // 2. Gemini AI
    try {
        console.log('2. Test de l\'API Gemini...');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
        const result = await model.generateContent('Dis bonjour en une phrase.');
        console.log('✅ Gemini AI Réponse:', result.response.text());
    } catch (err) {
        console.error('❌ Gemini AI Erreur:', err.message);
    }

    // 3. Cloudinary
    try {
        console.log('3. Configuration Cloudinary...');
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        console.log('✅ Cloudinary Configuré (vérification visuelle requise des clés).');
    } catch (err) {
        console.error('❌ Cloudinary Erreur:', err.message);
    }

    process.exit(0);
}

verify();
