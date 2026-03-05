const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crée le dossier Files à la racine du projet (au même niveau que backend/frontend)
const uploadDir = path.join(__dirname, '../../../Files');
console.log('--- UPLOAD CONFIG: Saving to', uploadDir);

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage local avec Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const defaultUpload = multer({ storage: storage });

// Wrapper pour intercepter le fichier uploadé et lui donner une URL correcte
const wrapSingle = (fieldName) => {
    return (req, res, next) => {
        console.log(`[MULTER DEBUG] Expecting field: ${fieldName}`);
        defaultUpload.single(fieldName)(req, res, function (err) {
            if (err) {
                console.error(`[MULTER ERROR] for field ${fieldName}:`, err);
                return next(err);
            }
            if (req.file) {
                console.log(`[MULTER SUCCESS] File received: ${req.file.fieldname} -> ${req.file.filename}`);
                const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
                const host = req.get('host'); // localhost:5002
                // L'URL absolue pour servir le fichier statiquement au frontend
                req.file.path = `${protocol}://${host}/Files/${req.file.filename}`;
            }
            next();
        });
    };
};

// Simulation de l'API Cloudinary pour ne pas casser les contrôleurs existants
const cloudinaryMock = {
    uploader: {
        destroy: async (publicId, options) => {
            try {
                if (!publicId) return { result: 'ok' };
                const filePath = path.join(uploadDir, publicId);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                return { result: 'ok' };
            } catch (err) {
                console.error("Erreur suppression de fichier local:", err);
                return { result: 'error' };
            }
        }
    }
};

module.exports = {
    cloudinary: cloudinaryMock,
    uploadDocument: { single: wrapSingle },
    uploadVideo: { single: wrapSingle },
    uploadSubmission: { single: wrapSingle },
    uploadImage: { single: wrapSingle },
};
