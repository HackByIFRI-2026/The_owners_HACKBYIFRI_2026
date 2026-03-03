require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
    console.log("Fetching available models...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        console.log("Models:");
        data.models.forEach(m => console.log(m.name, " - ", m.supportedGenerationMethods.join(", ")));
    } catch (e) {
        console.error("Failed to fetch models:", e.message);
    }
}
run();
