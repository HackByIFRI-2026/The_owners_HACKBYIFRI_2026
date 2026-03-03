const mongoose = require('mongoose');

// ================================================
// Sous-schéma : Entrée d'étudiant dans une salle
// ================================================
const studentEntrySchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING',
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
});

// ================================================
// Schéma principal : Salle de Classe
// ================================================
const classroomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Le nom de la salle est requis'],
            trim: true,
        },
        subject: {
            type: String,
            required: [true, 'La matière est requise'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        students: [studentEntrySchema],

        // Code d'invitation unique pour rejoindre la salle
        inviteCode: {
            type: String,
            unique: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// ================================================
// Middleware : Génère un code d'invitation unique avant création
// ================================================
classroomSchema.pre('save', function (next) {
    if (!this.inviteCode) {
        this.inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Classroom', classroomSchema);
