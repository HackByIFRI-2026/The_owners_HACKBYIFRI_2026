const cloudinary = require('cloudinary').v2;
// multer-storage-cloudinary v2 exports the constructor as the default export
const CloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Documents (PDF, DOC) ─────────────────────────────────────────────
const documentStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'kplon-nu/documents',
        allowed_formats: ['pdf', 'doc', 'docx'],
        resource_type: 'raw',
    },
});

// ── Vidéos ───────────────────────────────────────────────────────────
const videoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'kplon-nu/videos',
        allowed_formats: ['mp4', 'mov', 'avi', 'mkv'],
        resource_type: 'video',
    },
});

// ── Soumissions (ZIP, RAR) ───────────────────────────────────────────
const submissionStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'kplon-nu/submissions',
        allowed_formats: ['zip', 'rar', '7z', 'tar'],
        resource_type: 'raw',
    },
});

// ── Images (thumbnails, avatars) ─────────────────────────────────────
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'kplon-nu/images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
});

const uploadDocument = multer({ storage: documentStorage });
const uploadVideo = multer({ storage: videoStorage });
const uploadSubmission = multer({ storage: submissionStorage });
const uploadImage = multer({ storage: imageStorage });

module.exports = {
    cloudinary,
    uploadDocument,
    uploadVideo,
    uploadSubmission,
    uploadImage,
};
