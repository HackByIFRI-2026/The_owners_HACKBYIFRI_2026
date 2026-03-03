const mongoose = require('mongoose');

// ================================================
// Schéma : Exercice ou TP
// ================================================
const exerciseSchema = new mongoose.Schema(
    {
        classroom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Classroom',
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Le titre est requis'],
            trim: true,
        },
        instructions: {
            type: String,
            required: [true, 'Les instructions sont requises'],
        },
        type: {
            type: String,
            enum: ['EXERCISE', 'TP'],
            required: [true, 'Le type (EXERCISE ou TP) est requis'],
        },
        dueDate: {
            type: Date,
            default: null,
        },
        // Fichier joint de l'exercice si besoin (optionnel)
        attachmentUrl: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
