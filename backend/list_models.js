const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    console.log('--- STARTING LIST MODELS (SDK) ---');
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error('[FAIL] GEMINI_API_KEY manquant');
            return;
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        console.log('[SEARCH] Recherche via SDK...');
        // Note: listModels might not be available in all versions of the SDK, but let's try
        // If not, we fall back to a safer fetch check

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();

        if (data.error) {
            console.log('❌ Erreur API:', data.error.message);
            return;
        }

        console.log('\n[OK] LLM Modèles (GenerateContent) :\n');
        data.models.forEach(model => {
            const name = model.name.replace('models/', '');
            if (model.supportedGenerationMethods.includes('generateContent')) {
                console.log(`- ${name} [LLM]`);
            }
        });

    } catch (err) {
        console.log('[ERROR] Erreur SDK:', err.message);
    }
}

listModels();
