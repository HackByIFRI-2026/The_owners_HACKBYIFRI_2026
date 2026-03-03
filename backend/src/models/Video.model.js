const mongoose = require('mongoose');

// ================================================
// Sous-schéma pour les réponses imbriquées (récursif)
// ================================================
const replySchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: [true, 'Le texte de la réponse est requis'],
            trim: true,
        },
    },
    { timestamps: true }
);

// ================================================
// Sous-schéma Commentaire (avec réponses)
// ================================================
const commentSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: [true, 'Le commentaire ne peut pas être vide'],
            trim: true,
        },
        replies: [replySchema],
    },
    { timestamps: true }
);

// ================================================
// Schéma principal : Vidéo
// ================================================
const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Le titre est requis'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        videoUrl: {
            type: String,
            required: [true, "L'URL de la vidéo est requise"],
        },
        videoPublicId: {
            // Cloudinary public_id pour pouvoir supprimer
            type: String,
        },
        thumbnailUrl: {
            type: String,
            default: null,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Réactions
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        dislikes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        // Commentaires (activés ou non par le professeur)
        commentsEnabled: {
            type: Boolean,
            default: true,
        },
        comments: [commentSchema],

        // Compteur de vues
        views: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);
