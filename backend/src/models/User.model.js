const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        // --- Champs communs ---
        role: {
            type: String,
            enum: ['STUDENT', 'PROFESSOR', 'ADMIN'],
            // Non required car lors d'une connexion OAuth, le rôle est défini plus tard
        },
        firstName: {
            type: String,
            required: [true, 'Le prénom est requis'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Le nom est requis'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "L'email est requis"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/.+\@.+\..+/, 'Veuillez fournir un email valide'],
        },
        password: {
            type: String,
            minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
            select: false, // Jamais retourné par défaut dans les requêtes
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // Permet d'avoir null/undefined sans conflit unique
        },
        avatar: {
            type: String,
            default: null,
        },

        // --- Gestion du profil OAuth ---
        isProfileComplete: {
            type: Boolean,
            default: false,
        },

        // --- Gestion des abonnements ---
        plan: {
            type: String,
            enum: ['FREE', 'PREMIUM'],
            default: 'FREE',
        },

        // --- Champs spécifiques au STUDENT ---
        studyYear: {
            type: String,
            trim: true,
        },
        studentId: {
            // Matricule
            type: String,
            trim: true,
        },
        majors: {
            // Filière(s)
            type: [String],
        },

        // --- Champs spécifiques au PROFESSOR ---
        expertiseField: {
            // Domaine de compétence
            type: String,
            trim: true,
        },

        // --- Quota du Bot Mɛsi (réinitialisé chaque jour par un cron job) ---
        botQuestionsToday: {
            type: Number,
            default: 0,
        },
        lastBotQuestionDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true, // Ajoute automatiquement createdAt et updatedAt
    }
);

// ================================================
// Middleware Mongoose : Hash du mot de passe avant sauvegarde
// ================================================
userSchema.pre('save', async function () {
    // Ne hashe que si le mot de passe a été modifié
    if (!this.isModified('password') || !this.password) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// ================================================
// Méthode d'instance : Comparer les mots de passe
// ================================================
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
