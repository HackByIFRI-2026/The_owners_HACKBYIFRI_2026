import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Video, FileText, Plus, X, Loader2, ArrowRight, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { videoService } from '../services/services';
import toast from 'react-hot-toast';

export default function CreateVideoPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fileType, setFileType] = useState('VIDEO');
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tag: 'Algorithmique',
        videoUrl: '', // For demo/YT links
    });

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) setFile(selected);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const fd = new FormData();
            fd.append('title', formData.title);
            fd.append('description', formData.description);
            fd.append('tag', formData.tag);

            if (fileType === 'VIDEO') {
                if (file) {
                    fd.append('video', file);
                } else if (formData.videoUrl) {
                    fd.append('videoUrl', formData.videoUrl);
                } else {
                    throw new Error('Veuillez fournir une vidéo ou un lien YouTube');
                }
            } else if (fileType === 'PDF') {
                if (!file) throw new Error('Veuillez sélectionner un fichier PDF');
                // The backend currently creates a Video model even for PDF if using /videos endpoint
                // But let's use the field 'video' as expected by uploadVideo.single('video')
                fd.append('video', file);
            }

            await videoService.publishVideo(fd);
            toast.success('Contenu publié avec succès !');
            setTimeout(() => navigate('/videos'), 1500);
        } catch (error) {
            toast.error(error.message || 'Erreur lors de la publication');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container max-w-4xl">
            <div className="mb-10">
                <h2 className="text-2xl font-display text-primary mb-2">Publier du contenu</h2>
                <p className="text-secondary text-sm">Ajoutez une nouvelle ressource pédagogique à votre classe ou à la bibliothèque publique.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
                    <div className="card space-y-6 p-8">
                        <div className="input-group">
                            <label className="input-label">Titre du contenu</label>
                            <input
                                className="input-field" placeholder="Ex: Introduction au Machine Learning" required
                                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="input-group">
                                <label className="input-label">Type de ressource</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button" onClick={() => setFileType('VIDEO')}
                                        className={`flex-1 py-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 ${fileType === 'VIDEO' ? 'border-amber bg-amber/5 text-amber' : 'border-white/5 bg-raised text-muted'}`}
                                    >
                                        <Video size={16} /> Vidéo
                                    </button>
                                    <button
                                        type="button" onClick={() => setFileType('PDF')}
                                        className={`flex-1 py-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 ${fileType === 'PDF' ? 'border-amber bg-amber/5 text-amber' : 'border-white/5 bg-raised text-muted'}`}
                                    >
                                        <FileText size={16} /> PDF
                                    </button>
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Catégorie</label>
                                <select
                                    className="input-field" value={formData.tag}
                                    onChange={e => setFormData({ ...formData, tag: e.target.value })}
                                >
                                    <option value="Algorithmique">Algorithmique</option>
                                    <option value="Bases de Données">Bases de Données</option>
                                    <option value="Développement Web">Développement Web</option>
                                    <option value="Intelligence Artificielle">IA</option>
                                    <option value="Réseaux">Réseaux</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Description (optionnelle)</label>
                            <textarea
                                className="input-field min-h-[120px]" placeholder="Détails sur le contenu..."
                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {fileType === 'VIDEO' && (
                            <div className="input-group">
                                <label className="input-label">Lien Vidéo (YouTube/Vimeo)</label>
                                <input
                                    className="input-field" placeholder="https://youtube.com/..."
                                    value={formData.videoUrl} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                />
                                <p className="text-[10px] text-muted mt-2 font-mono uppercase tracking-widest">Ou téléchargez un fichier ci-contre</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">Annuler</button>
                        <button disabled={loading} className="btn btn-primary px-10">
                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Publier la ressource'}
                        </button>
                    </div>
                </form>

                {/* File Upload Sidebar */}
                <div className="space-y-6">
                    <div className="card p-6 border-dashed border-2 border-white/10 hover:border-amber/30 transition-all group">
                        <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center py-10">
                            <div className="w-14 h-14 bg-amber/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload size={24} className="text-amber" />
                            </div>
                            <span className="text-sm font-bold text-primary mb-1">
                                {file ? file.name : `Télécharger un fichier ${fileType}`}
                            </span>
                            <span className="text-xs text-muted">Max: 100MB</span>
                        </label>
                    </div>

                    <div className="card bg-amber/5 border-amber/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber/10 rounded-lg text-amber"><Info size={18} /></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-amber">Directives</span>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex gap-2 text-xs text-secondary">
                                <div className="w-1 h-1 bg-amber rounded-full mt-1.5 shrink-0"></div>
                                Utilisez des titres clairs et concis.
                            </li>
                            <li className="flex gap-2 text-xs text-secondary">
                                <div className="w-1 h-1 bg-amber rounded-full mt-1.5 shrink-0"></div>
                                Ajoutez une description pour indexer le contenu avec Mɛsi.
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}
