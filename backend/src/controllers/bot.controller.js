const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @desc    Poser une question au Bot Mɛsi
 * @route   POST /api/v1/bot/ask
 * @access  Private/Student
 */
exports.askQuestion = async (req, res, next) => {
    try {
        const { question, courseContext } = req.body;

        if (!question || question.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Veuillez poser une question.' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemInstruction = `
      Tu es Mɛsi, un assistant éducatif bienveillant et pédagogue intégré dans la plateforme e-learning "Kplɔ́n nǔ".
      Ton rôle est d'aider les étudiants à comprendre leurs cours, de manière claire, concise et didactique.
      Tu t'appuies principalement sur le contexte du cours fourni.
      Si la question est hors sujet, rappelle poliment que tu te concentres sur les cours.
      Tu reponds toujours en français, sauf si l'étudiant le demande autrement.
      Ne fais pas les devoirs des étudiants à leur place, guide-les plutôt dans leur réflexion.
    `;

        const prompt = `
      ${systemInstruction}

      ${courseContext ? `--- CONTEXTE DU COURS ---\n${courseContext}\n--- FIN DU CONTEXTE ---\n` : ''}

      Question de l'étudiant: ${question}
    `;

        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        // Incrémenter le compteur de questions du jour pour les utilisateurs FREE
        if (req.user.plan === 'FREE') {
            req.user.botQuestionsToday += 1;
            req.user.lastBotQuestionDate = new Date();
            await req.user.save();
        }

        res.status(200).json({
            success: true,
            data: {
                answer,
                questionsUsed: req.user.plan === 'FREE' ? req.user.botQuestionsToday : null,
                questionsLimit: req.user.plan === 'FREE' ? 20 : null,
                plan: req.user.plan,
            },
        });
    } catch (err) {
        console.error('Erreur Gemini API:', err.message);
        next(err);
    }
};

/**
 * @desc    Générer des Flashcards à partir d'un contenu de cours
 * @route   POST /api/v1/bot/flashcards
 * @access  Private/Student
 */
exports.generateFlashcards = async (req, res, next) => {
    try {
        const { courseContent, numberOfCards } = req.body;

        if (!courseContent) {
            return res.status(400).json({ success: false, message: 'Le contenu du cours est requis.' });
        }

        const count = numberOfCards || 10;
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
      Tu es un expert en pédagogie. À partir du contenu de cours ci-dessous, génère exactement ${count} flashcards de révision.
      Chaque flashcard doit avoir :
        - "question": une question sur un concept clé du cours
        - "answer": la réponse concise et précise
      
      Réponds UNIQUEMENT avec un tableau JSON valide, sans aucun text en dehors du JSON. 
      Format: [{"question": "...", "answer": "..."}, ...]

      Contenu du cours:
      ${courseContent}
    `;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Nettoyer la réponse (enlever les backticks markdown si présents)
        responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        let flashcards;
        try {
            flashcards = JSON.parse(responseText);
        } catch {
            return res.status(500).json({ success: false, message: 'Impossible de parser les flashcards générées.' });
        }

        res.status(200).json({
            success: true,
            count: flashcards.length,
            data: flashcards,
        });
    } catch (err) {
        console.error('Erreur génération flashcards Gemini:', err.message);
        next(err);
    }
};
