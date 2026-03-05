const Video = require('../models/Video.model');
const { cloudinary } = require('../config/cloudinary');

/**
 * @desc    Lister toutes les vidéos (public)
 * @route   GET /api/v1/videos
 * @access  Public
 */
exports.getAllVideos = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const videos = await Video.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'firstName lastName avatar expertiseField');

        const total = await Video.countDocuments();

        res.status(200).json({
            success: true,
            count: videos.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: videos,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Obtenir une vidéo par ID (incrémente les vues)
 * @route   GET /api/v1/videos/:id
 * @access  Public
 */
exports.getVideoById = async (req, res, next) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('author', 'firstName lastName avatar expertiseField')
            .populate('comments.author', 'firstName lastName avatar')
            .populate('comments.replies.author', 'firstName lastName avatar');

        if (!video) {
            return res.status(404).json({ success: false, message: 'Vidéo introuvable.' });
        }

        res.status(200).json({ success: true, data: video });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Publier une vidéo (upload fichier)
 * @route   POST /api/v1/videos
 * @access  Private/Professor
 */
exports.createVideo = async (req, res, next) => {
    try {
        const { title, description, videoUrl: bodyVideoUrl, commentsEnabled } = req.body;

        let finalVideoUrl = bodyVideoUrl;
        let publicId = null;

        if (req.file) {
            finalVideoUrl = req.file.path;
            publicId = req.file.filename;
        }

        if (!finalVideoUrl) {
            return res.status(400).json({ success: false, message: 'Veuillez fournir un fichier vidéo ou un lien.' });
        }

        const video = await Video.create({
            title,
            description,
            videoUrl: finalVideoUrl,
            videoPublicId: publicId,
            author: req.user._id,
            commentsEnabled: commentsEnabled !== undefined ? commentsEnabled : true,
        });

        res.status(201).json({ success: true, data: video });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Supprimer une vidéo (propriétaire seulement)
 * @route   DELETE /api/v1/videos/:id
 * @access  Private/Professor
 */
exports.deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) return res.status(404).json({ success: false, message: 'Vidéo introuvable.' });

        if (video.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Vous ne pouvez supprimer que vos propres vidéos.' });
        }

        // Supprimer sur Cloudinary
        if (video.videoPublicId) {
            await cloudinary.uploader.destroy(video.videoPublicId, { resource_type: 'video' });
        }

        await video.deleteOne();
        res.status(200).json({ success: true, message: 'Vidéo supprimée avec succès.' });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Réagir à une vidéo (like ou dislike)
 * @route   POST /api/v1/videos/:id/react
 * @access  Private
 */
exports.reactToVideo = async (req, res, next) => {
    try {
        const { reaction } = req.body; // 'like' ou 'dislike'
        if (!['like', 'dislike'].includes(reaction)) {
            return res.status(400).json({ success: false, message: "La réaction doit être 'like' ou 'dislike'." });
        }

        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ success: false, message: 'Vidéo introuvable.' });

        const userId = req.user._id;
        const likeIndex = video.likes.indexOf(userId);
        const dislikeIndex = video.dislikes.indexOf(userId);

        if (reaction === 'like') {
            if (likeIndex > -1) {
                video.likes.splice(likeIndex, 1); // Annuler le like
            } else {
                video.likes.push(userId);
                if (dislikeIndex > -1) video.dislikes.splice(dislikeIndex, 1); // Retirer dislike
            }
        } else {
            if (dislikeIndex > -1) {
                video.dislikes.splice(dislikeIndex, 1); // Annuler le dislike
            } else {
                video.dislikes.push(userId);
                if (likeIndex > -1) video.likes.splice(likeIndex, 1); // Retirer like
            }
        }

        await video.save();
        res.status(200).json({
            success: true,
            data: { likes: video.likes.length, dislikes: video.dislikes.length },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Ajouter un commentaire
 * @route   POST /api/v1/videos/:id/comments
 * @access  Private
 */
exports.addComment = async (req, res, next) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ success: false, message: 'Le commentaire ne peut pas être vide.' });

        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ success: false, message: 'Vidéo introuvable.' });
        if (!video.commentsEnabled) {
            return res.status(403).json({ success: false, message: 'Les commentaires sont désactivés pour cette vidéo.' });
        }

        video.comments.unshift({ author: req.user._id, text });
        await video.save();

        await video.populate('comments.author', 'firstName lastName avatar');
        res.status(201).json({ success: true, data: video.comments[0] });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Répondre à un commentaire
 * @route   POST /api/v1/videos/:id/comments/:commentId/replies
 * @access  Private
 */
exports.replyToComment = async (req, res, next) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ success: false, message: 'La réponse ne peut pas être vide.' });

        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ success: false, message: 'Vidéo introuvable.' });

        const comment = video.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ success: false, message: 'Commentaire introuvable.' });

        comment.replies.push({ author: req.user._id, text });
        await video.save();

        res.status(201).json({ success: true, data: comment.replies[comment.replies.length - 1] });
    } catch (err) {
        next(err);
    }
};
