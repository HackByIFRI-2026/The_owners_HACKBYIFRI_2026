const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Le titre du quiz est requis'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        questions: [
            {
                q: { type: String, required: true },
                opts: [{ type: String, required: true }],
                answer: { type: Number, required: true }, // Index of the correct option
                explication: { type: String, required: true },
            }
        ],
        tags: [{ type: String }],
        difficulty: {
            type: String,
            enum: ['EASY', 'MEDIUM', 'HARD'],
            default: 'MEDIUM'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
