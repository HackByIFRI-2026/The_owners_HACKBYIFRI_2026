const mongoose = require('mongoose');

// ================================================
// Schéma : Soumission d'un étudiant
// ================================================
const submissionSchema = new mongoose.Schema(
    {
        exercise: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercise',
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Soumission par fichier ZIP (stocké sur Cloudinary)
        fileUrl: {
            type: String,
            default: null,
        },
        filePublicId: {
            type: String,
            default: null,
        },
        // Soumission par lien (GitHub ou Drive)
        linkUrl: {
            type: String,
            default: null,
        },
        linkType: {
            type: String,
            enum: ['GITHUB', 'DRIVE', 'OTHER', null],
            default: null,
        },

        // --- Correction par le professeur ---
        isGraded: {
            type: Boolean,
            default: false,
        },
        grade: {
            type: Number,
            min: 0,
            max: 20,
            default: null,
        },
        feedbackText: {
            type: String,
            default: null,
        },
        feedbackFileUrl: {
            type: String,
            default: null,
        },
        gradedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Un étudiant ne peut soumettre qu'une seule fois par exercice
submissionSchema.index({ exercise: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
