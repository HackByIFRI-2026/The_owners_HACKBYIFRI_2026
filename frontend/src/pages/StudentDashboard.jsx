import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, BarChart2, Target, Layers, TrendingUp, School, Zap, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { classroomService, userService } from '../services/services';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
    const { user } = useAuthStore();
    const [classrooms, setClassrooms] = useState([]);
    const [statsData, setStatsData] = useState(null);
    const [loadingCls, setLoadingCls] = useState(true);

    useEffect(() => {
        classroomService.getMyEnrollments()
            .then(({ data }) => setClassrooms(data.data?.slice(0, 3) || []))
            .catch(() => { })
            .finally(() => setLoadingCls(false));

        userService.getMyStats()
            .then(({ data }) => setStatsData(data.data))
            .catch(console.error);
    }, []);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

    const statCards = [
        { label: 'Salles actives', value: statsData?.stats?.activeClassrooms || '-', color: 'var(--amber)', icon: School, variant: '' },
        { label: 'Streak journalier', value: statsData?.stats?.streak || '-', color: 'var(--coral)', icon: Zap, variant: 'coral' },
        { label: 'Moy. quiz', value: statsData?.stats?.quizAvg ? `${statsData.stats.quizAvg}%` : '-', color: 'var(--jade)', icon: Target, variant: 'jade' },
        { label: 'Flashcards révisées', value: statsData?.stats?.flashcards || '-', color: 'var(--violet)', icon: Layers, variant: 'violet' },
    ];

    return (
        <div className="page-container">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 4 }}>
                    {greeting}, {user?.firstName || 'Étudiant'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Voici un aperçu de votre progression aujourd'hui.</p>
            </motion.div>

            {/* Stats Row */}
            <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16, marginBottom: 28 }}>
                {statCards.map(({ label, value, color, icon: Icon, variant }) => (
                    <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`stat-card animate-fade-in ${variant}`}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Icon size={18} color={color} />
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>total</span>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: 'var(--font-display)', marginBottom: 4 }}>
                            {statsData ? value : <div className="skeleton" style={{ height: 32, width: 48, borderRadius: 4 }} />}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</div>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
                {/* Classrooms progress */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16 }}>Mes salles — Progression</h3>
                        <Link to="/classrooms" style={{ fontSize: 13, color: 'var(--amber)' }}>Voir tout →</Link>
                    </div>
                    <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {loadingCls ? (
                            [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 16 }} />)
                        ) : classrooms.length > 0 ? (
                            classrooms.map((cls, i) => {
                                const progress = cls.progress || Math.floor(Math.random() * 70) + 10;
                                const color = ['var(--amber)', 'var(--jade)', 'var(--violet)'][i % 3];
                                return (
                                    <Link key={cls._id || i} to={`/classrooms/${cls._id || i}`} className="card card-hover animate-fade-in" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <BookOpen size={18} color={color} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {cls.name}
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${progress}%`, background: color }} />
                                            </div>
                                        </div>
                                        <span style={{ fontSize: 13, color: 'var(--text-muted)', flexShrink: 0 }}>{progress}%</span>
                                    </Link>
                                );
                            })
                        ) : (
                            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
                                Aucune salle active
                            </div>
                        )}
                    </div>
                </div>

                {/* Right panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Next session */}
                    <div className="card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                            <Clock size={16} color="var(--jade)" />
                            <span style={{ fontWeight: 700, fontSize: 14 }}>Prochain live</span>
                        </div>
                        {statsData ? (
                            <>
                                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{statsData.nextSession.name}</div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>{statsData.nextSession.date}</div>
                                <button disabled={!statsData.nextSession.isLive} className="btn btn-jade btn-full btn-sm">Rejoindre le live</button>
                            </>
                        ) : (
                            <div className="skeleton" style={{ height: 60, borderRadius: 8 }} />
                        )}
                    </div>

                    {/* Quick actions */}
                    <div className="card" style={{ padding: 20 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Accès rapide</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { to: '/ai-assistant', icon: Brain, label: 'Poser une question à Mɛsi', color: 'var(--violet)' },
                                { to: '/flashcards', icon: Layers, label: 'Réviser mes flashcards', color: 'var(--amber)' },
                                { to: '/quiz', label: 'Faire un quiz rapide', icon: Target, color: 'var(--jade)' },
                                { to: '/progress', label: 'Voir ma progression', icon: TrendingUp, color: 'var(--coral)' },
                            ].map(({ to, icon: Icon, label, color }) => (
                                <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: 'var(--bg-raised)', transition: 'all 0.2s', textDecoration: 'none', color: 'var(--text-primary)', fontSize: 13 }}>
                                    <Icon size={15} color={color} /> {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
