import { useState, useEffect } from 'react';
import { Video, ThumbsUp, ThumbsDown, Eye, Search, Loader2, Play, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { videoService } from '../services/services';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const TAGS = ['Tout', 'Algorithmique', 'Bases de Données', 'Développement Web', 'Réseaux', 'Sécurité', 'Intelligence Artificielle'];

function VideoCard({ video, onClick }) {
    return (
        <motion.div onClick={() => onClick(video)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card card-hover" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ height: 160, background: 'linear-gradient(135deg, var(--bg-raised), var(--bg-deep))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', border: '2px solid var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    <Play size={22} color="var(--amber)" fill="var(--amber)" style={{ marginLeft: 3 }} />
                </div>
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <span className="badge badge-amber" style={{ fontSize: 10 }}>{video.tag}</span>
                </div>
                <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.7)', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'white' }}>
                    {video.duration}
                </div>
            </div>
            <div style={{ padding: '16px' }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, lineHeight: 1.4 }}>{video.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{video.professor}</div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={12} /> {video.views.toLocaleString()}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ThumbsUp size={12} /> {video.likes}</span>
                </div>
            </div>
        </motion.div>
    );
}

export default function VideosPage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTag, setActiveTag] = useState('Tout');
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        videoService.getVideos({ page, limit: 12 })
            .then(({ data }) => setVideos(data.data?.videos || data.data || []))
            .catch(() => setVideos([]))
            .finally(() => setLoading(false));
    }, [page]);

    const displayVideos = videos.filter(v => {
        const matchSearch = !search || v.title?.toLowerCase().includes(search.toLowerCase());
        const matchTag = activeTag === 'Tout' || v.tag === activeTag;
        return matchSearch && matchTag;
    });

    const handleReact = async (videoId, reaction) => {
        try {
            await videoService.reactToVideo(videoId, reaction);
            toast.success(reaction === 'LIKE' ? 'Aimé !' : 'Noté');
        } catch { toast.error('Connectez-vous pour réagir'); }
    };

    return (
        <div className="page-container">
            {/* Selected video player */}
            {selected && (
                <div style={{ marginBottom: 28 }}>
                    <div style={{ background: 'var(--bg-deep)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        {selected.videoUrl ? (
                            <ReactPlayer url={selected.videoUrl} width="100%" height={400} controls />
                        ) : (
                            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-raised)', color: 'var(--text-muted)', flexDirection: 'column', gap: 12 }}>
                                <Video size={40} style={{ opacity: 0.3 }} />
                                <span style={{ fontSize: 14 }}>Vidéo non disponible en démo</span>
                            </div>
                        )}
                    </div>
                    <div style={{ padding: '16px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{selected.title}</h3>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selected.professor} · {selected.views} vues</div>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => handleReact(selected._id, 'LIKE')} className="btn btn-secondary btn-sm"><ThumbsUp size={14} /> {selected.likes}</button>
                            <button onClick={() => handleReact(selected._id, 'DISLIKE')} className="btn btn-secondary btn-sm"><ThumbsDown size={14} /></button>
                            <button onClick={() => setSelected(null)} className="btn btn-ghost btn-sm">Fermer</button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Bibliothèque vidéo</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Cours publiés par les professeurs</p>
                </div>
                <div style={{ position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} className="input-field" style={{ paddingLeft: 36, marginBottom: 0, minWidth: 240 }} placeholder="Rechercher une vidéo..." />
                </div>
            </div>

            {/* Tag filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {TAGS.map(tag => (
                    <button key={tag} onClick={() => setActiveTag(tag)} style={{ padding: '5px 14px', borderRadius: 100, fontSize: 13, border: '1px solid', borderColor: activeTag === tag ? 'var(--amber)' : 'var(--border)', background: activeTag === tag ? 'var(--amber-glow)' : 'transparent', color: activeTag === tag ? 'var(--amber)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}>
                        {tag}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton" style={{ height: 260, borderRadius: 20 }} />)}
                </div>
            ) : (
                <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                    {displayVideos.map(video => <VideoCard key={video._id} video={video} onClick={setSelected} />)}
                    {displayVideos.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
                            <Video size={48} style={{ opacity: 0.2, display: 'block', margin: '0 auto 16px' }} />
                            <div>Aucune vidéo trouvée</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
