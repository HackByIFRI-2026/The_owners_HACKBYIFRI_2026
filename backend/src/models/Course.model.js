const mongoose = require('mongoose');

// ================================================
// Schéma : Support de Cours (Texte ou PDF)
// ================================================
const courseSchema = new mongoose.Schema(
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
            required: [true, 'Le titre du cours est requis'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        type: {
            type: String,
            enum: ['TEXT', 'PDF'],
            required: [true, 'Le type de cours est requis (TEXT ou PDF)'],
        },
        // Pour type TEXT
        textContent: {
            type: String,
            default: '',
        },
        // Pour type PDF
        fileUrl: {
            type: String,
            default: null,
        },
        filePublicId: {
            type: String,
            default: null,
        },
        fileName: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
