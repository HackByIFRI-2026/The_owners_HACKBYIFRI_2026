const mongoose = require('mongoose');

// ================================================
// Schéma : Enregistrement de présence (Live Session)
// ================================================
const attendanceRecordSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['PRESENT', 'LATE', 'ABSENT'],
        default: 'ABSENT',
    },
    joinedAt: {
        type: Date,
        default: null,
    },
});

// ================================================
// Schéma principal : Session de Visioconférence
// ================================================
const sessionSchema = new mongoose.Schema(
    {
        classroom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Classroom',
            required: true,
        },
        professor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Le titre de la session est requis'],
            trim: true,
        },
        scheduledStart: {
            type: Date,
            required: [true, 'La date de début est requise'],
        },
        scheduledEnd: {
            type: Date,
            required: [true, 'La date de fin est requise'],
        },
        // Tolérance en minutes pour ne pas être considéré en retard
        lateThresholdMinutes: {
            type: Number,
            default: 15,
        },
        status: {
            type: String,
            enum: ['SCHEDULED', 'LIVE', 'ENDED'],
            default: 'SCHEDULED',
        },
        // ID de salle Jitsi ou autre (généré à la création ou au démarrage)
        roomId: {
            type: String,
            unique: true,
        },
        // Feuille de présence
        attendance: [attendanceRecordSchema],
    },
    { timestamps: true }
);

// Génère un roomId unique avant la sauvegarde
sessionSchema.pre('save', function () {
    if (!this.roomId) {
        this.roomId = `kplon-${this._id.toString()}`;
    }
});

// Virtual pour le lien de réunion (Jitsi par défaut)
sessionSchema.virtual('meetingUrl').get(function () {
    return `https://meet.jit.si/${this.roomId}`;
});

sessionSchema.set('toJSON', { virtuals: true });
sessionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Session', sessionSchema);
