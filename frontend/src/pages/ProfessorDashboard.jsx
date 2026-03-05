import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Video, PlusCircle, School, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { classroomService } from '../services/services';
import toast from 'react-hot-toast';

const COLORS = ['var(--amber)', 'var(--jade)', 'var(--violet)', 'var(--coral)'];

export default function ProfessorDashboard() {
    const { user } = useAuthStore();
    const [classrooms, setClassrooms] = useState([]);
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.allSettled([
            classroomService.getMyClassrooms()
                .then(({ data }) => setClassrooms(data.data || [])),
        ]).finally(() => setLoading(false));
    }, []);

    const stats = [
        { label: 'Salles créées', value: classrooms.length || '—', color: 'var(--amber)', unit: '', icon: School, variant: '' },
        { label: 'Étudiants total', value: classrooms.reduce((s, c) => s + (c.studentsCount || 0), 0) || '—', color: 'var(--jade)', unit: '', icon: Users, variant: 'jade' },
        { label: 'Quota utilisé', value: `${classrooms.length}/10`, color: 'var(--violet)', unit: '', icon: BookOpen, variant: 'violet' },
        { label: 'Sessions live', value: '3', color: 'var(--coral)', unit: '', icon: Video, variant: 'coral' },
    ];

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 4 }}>
                        {greeting}, Prof. {user?.lastName || 'Professeur'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Gérez vos salles de classe et publiez du contenu.</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <Link to="/classrooms" className="btn btn-secondary btn-sm"><School size={15} /> Mes salles</Link>
                    <Link to="/create-video" className="btn btn-primary btn-sm"><PlusCircle size={15} /> Publier une vidéo</Link>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16, marginBottom: 28 }}>
                {stats.map(({ label, value, color, icon: Icon, variant }) => (
                    <div key={label} className={`stat-card animate-fade-in ${variant}`}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Icon size={18} color={color} />
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: 'var(--font-display)', marginBottom: 4 }}>{loading ? '—' : value}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
                {/* Classrooms */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16 }}>Mes salles de classe</h3>
                        <Link to="/classrooms" style={{ fontSize: 13, color: 'var(--amber)' }}>Tout gérer →</Link>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />)}
                        </div>
                    ) : classrooms.length === 0 ? (
                        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
                            <School size={40} style={{ marginBottom: 12, opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
                            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Aucune salle créée</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>Créez votre première salle de classe pour commencer à enseigner.</p>
                            <Link to="/classrooms" className="btn btn-primary btn-sm"><PlusCircle size={14} /> Créer une salle</Link>
                        </div>
                    ) : (
                        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {classrooms.slice(0, 5).map((cls, i) => (
                                <Link key={cls._id || i} to={`/classrooms/${cls._id || i}`} className="card card-hover animate-fade-in" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none' }}>
                                    <div style={{ width: 5, height: 48, background: COLORS[i % 4], borderRadius: 3, flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cls.name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 12 }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Users size={11} /> {cls.studentsCount || 0} étudiants</span>
                                            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>#{cls.inviteCode}</span>
                                        </div>
                                    </div>
                                    {cls.pendingCount > 0 && (
                                        <span className="badge badge-amber">{cls.pendingCount} en attente</span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="card" style={{ padding: 20 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Actions rapides</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { to: '/create-video', icon: Video, label: 'Publier une vidéo', color: 'var(--coral)' },
                                { to: '/classrooms', icon: PlusCircle, label: 'Créer une salle', color: 'var(--amber)' },
                                { to: '/students', icon: Users, label: 'Voir mes étudiants', color: 'var(--jade)' },
                            ].map(({ to, icon: Icon, label, color }) => (
                                <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: 'var(--bg-raised)', textDecoration: 'none', color: 'var(--text-primary)', fontSize: 13, transition: 'all 0.2s' }}>
                                    <Icon size={15} color={color} /> {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quota visualisé */}
                    <div className="card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <span style={{ fontWeight: 700, fontSize: 14 }}>Quota salles</span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{classrooms.length}/10</span>
                        </div>
                        <div className="progress-bar" style={{ marginBottom: 8 }}>
                            <div className="progress-fill" style={{ width: `${classrooms.length * 10}%` }} />
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{10 - classrooms.length} salles disponibles sur le plan gratuit</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
