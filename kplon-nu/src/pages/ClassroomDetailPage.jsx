import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { BookOpen, FileText, Video, Code, Clock, Users, Plus, Upload, ChevronLeft, CheckCircle, X, Send, Loader, Download, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const CLASSROOM_DETAIL = {
    1: {
        name: 'Algorithmique & Structures de Données L2',
        professor: 'Prof. Koffi Ahouant',
        subject: 'Informatique',
        color: '#F0A500',
        studentsCount: 87,
        inviteCode: 'ALGO-2024',
        courses: [
            { id: 1, title: 'Introduction aux algorithmes', type: 'video', size: '45 min', published: '3 Jan' },
            { id: 2, title: 'Complexité algorithmique', type: 'video', size: '50 min', published: '10 Jan' },
            { id: 3, title: 'Cours complet — Listes & Arbres', type: 'pdf', size: '2.3 MB', published: '17 Jan' },
        ],
        exercises: [
            { id: 1, title: 'TP 1 : Implémentation d\'une liste chaînée', dueDate: '15 Mars 2024', submitted: true, score: 78 },
            { id: 2, title: 'TP 2 : Algorithme de tri rapide', dueDate: '29 Mars 2024', submitted: false, score: null },
            { id: 3, title: 'Projet final : Arbre binaire de recherche', dueDate: '20 Avr 2024', submitted: false, score: null },
        ],
        sessions: [
            { id: 1, title: 'Cours magistral — Graphes & BFS', date: 'Lun 4 Mars', time: '14h00', status: 'past' },
            { id: 2, title: 'Session Question/Réponse', date: 'Lun 11 Mars', time: '14h00', status: 'upcoming' },
            { id: 3, title: 'Correction TP 1', date: 'Lun 18 Mars', time: '14h00', status: 'upcoming' },
        ],
    },
};

const getDefaultDetail = (id) => ({
    name: `Salle ${id}`,
    professor: 'Prof. Koffi Ahouant',
    subject: 'Cours',
    color: '#10B981',
    studentsCount: 42,
    inviteCode: 'CODE-24',
    courses: [],
    exercises: [],
    sessions: [],
});

export default function ClassroomDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const isProfessor = user?.role === 'professor';
    const classroom = CLASSROOM_DETAIL[parseInt(id)] || getDefaultDetail(id);
    const [activeTab, setActiveTab] = useState('courses');
    const [submitting, setSubmitting] = useState(null);

    const handleSubmitExercise = (exerciseId) => {
        setSubmitting(exerciseId);
        setTimeout(() => {
            setSubmitting(null);
            toast.success('TP soumis avec succès !');
        }, 1200);
    };

    const TABS = isProfessor
        ? [['courses', 'Cours', BookOpen], ['exercises', 'Exercices', Code], ['sessions', 'Sessions live', Video], ['students', 'Étudiants', Users]]
        : [['courses', 'Cours', BookOpen], ['exercises', 'Exercices', Code], ['sessions', 'Sessions live', Video]];

    return (
        <div className="page-container">
            {/* Breadcrumb */}
            <Link to="/classrooms" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, textDecoration: 'none' }}>
                <ChevronLeft size={15} /> Mes salles
            </Link>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${classroom.color}20`, border: `2px solid ${classroom.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={24} color={classroom.color} />
                    </div>
                    <div>
                        <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{classroom.name}</h2>
                        <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                            <span>{classroom.professor}</span>
                            <span>·</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} /> {classroom.studentsCount} étudiants</span>
                        </div>
                    </div>
                </div>
                {isProfessor && (
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => toast.success('Session live démarrée !')} className="btn btn-primary">
                            <Video size={15} /> Lancer une session
                        </button>
                        <button className="btn btn-secondary">
                            <Plus size={15} /> Publier un cours
                        </button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
                {TABS.map(([tab, label, Icon]) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '10px 16px', background: 'none',
                            border: 'none', cursor: 'pointer',
                            fontSize: 14, fontFamily: 'var(--font-body)',
                            color: activeTab === tab ? 'var(--amber)' : 'var(--text-secondary)',
                            borderBottom: `2px solid ${activeTab === tab ? 'var(--amber)' : 'transparent'}`,
                            transition: 'all 0.2s', marginBottom: -1,
                        }}
                    >
                        <Icon size={15} /> {label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {activeTab === 'courses' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {classroom.courses.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                            <BookOpen size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                            <div>Aucun cours publié dans cette salle</div>
                            {isProfessor && <button className="btn btn-primary" style={{ marginTop: 16 }}><Plus size={14} /> Publier un cours</button>}
                        </div>
                    ) : classroom.courses.map(course => (
                        <div key={course.id} className="card card-hover" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                background: course.type === 'video' ? 'rgba(16,185,129,0.15)' : course.type === 'pdf' ? 'rgba(255,107,107,0.15)' : 'rgba(139,92,246,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {course.type === 'video' ? <Video size={18} color="var(--jade)" /> : course.type === 'pdf' ? <FileText size={18} color="var(--coral)" /> : <Code size={18} color="var(--violet)" />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{course.title}</div>
                                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                                    <span className={`badge ${course.type === 'video' ? 'badge-jade' : course.type === 'pdf' ? 'badge-coral' : 'badge-violet'}`} style={{ fontSize: 10 }}>
                                        {course.type === 'video' ? 'Vidéo' : course.type === 'pdf' ? 'PDF' : 'TP'}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11} /> {course.size}</span>
                                    <span>Publié le {course.published}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-secondary btn-sm" style={{ gap: 6 }}>
                                    {course.type === 'video' ? <Video size={13} /> : <Download size={13} />}
                                    {course.type === 'video' ? 'Regarder' : 'Télécharger'}
                                </button>
                                {isProfessor && <button onClick={() => toast.error('Cours supprimé')} className="btn btn-ghost btn-sm"><X size={13} /></button>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'exercises' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {isProfessor && (
                        <button className="btn btn-secondary" style={{ width: 'fit-content', marginBottom: 8 }}>
                            <Plus size={14} /> Créer un exercice
                        </button>
                    )}
                    {classroom.exercises.map(exercise => (
                        <div key={exercise.id} className="card" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{exercise.title}</div>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Clock size={12} /> Date limite : <strong style={{ color: exercise.submitted ? 'var(--jade)' : 'var(--amber)' }}>{exercise.dueDate}</strong>
                                        </span>
                                        {exercise.submitted && exercise.score !== null && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Star size={12} color="var(--amber)" /> Note : <strong style={{ color: 'var(--amber)' }}>{exercise.score}/100</strong>
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    {!isProfessor && (
                                        exercise.submitted ? (
                                            <div className="badge badge-jade" style={{ gap: 6 }}><CheckCircle size={12} /> Soumis</div>
                                        ) : (
                                            <button
                                                onClick={() => handleSubmitExercise(exercise.id)}
                                                disabled={submitting === exercise.id}
                                                className="btn btn-primary btn-sm"
                                            >
                                                {submitting === exercise.id ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={14} />}
                                                Soumettre
                                            </button>
                                        )
                                    )}
                                    {isProfessor && (
                                        <Link to={`/classrooms/${id}/exercises/${exercise.id}/submissions`} className="btn btn-secondary btn-sm">
                                            Voir les rendus
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {classroom.exercises.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                            <Code size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                            <div>Aucun exercice pour le moment</div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'sessions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {isProfessor && (
                        <button onClick={() => toast.success('Nouvelle session planifiée !')} className="btn btn-secondary" style={{ width: 'fit-content', marginBottom: 8 }}>
                            <Plus size={14} /> Planifier une session
                        </button>
                    )}
                    {classroom.sessions.map(session => (
                        <div key={session.id} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                background: session.status === 'live' ? 'rgba(255,107,107,0.15)' : session.status === 'upcoming' ? 'rgba(0,201,167,0.15)' : 'rgba(255,255,255,0.04)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Video size={18} color={session.status === 'live' ? 'var(--coral)' : session.status === 'upcoming' ? 'var(--jade)' : 'var(--text-muted)'} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{session.title}</div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                                    <span>{session.date}</span>
                                    <span>·</span>
                                    <span>{session.time}</span>
                                </div>
                            </div>
                            {session.status === 'live' && (
                                <button className="btn btn-danger btn-sm" style={{ gap: 6 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} /> Rejoindre LIVE
                                </button>
                            )}
                            {session.status === 'upcoming' && !isProfessor && (
                                <span className="badge badge-jade" style={{ fontSize: 11 }}>À venir</span>
                            )}
                            {session.status === 'upcoming' && isProfessor && (
                                <button onClick={() => toast.success('Session démarrée !')} className="btn btn-primary btn-sm">
                                    <Video size={13} /> Démarrer
                                </button>
                            )}
                            {session.status === 'past' && <span className="badge badge-muted" style={{ fontSize: 11 }}>Terminée</span>}
                        </div>
                    ))}
                    {classroom.sessions.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                            <Video size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                            <div>Aucune session planifiée</div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'students' && isProfessor && (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                {['Étudiant', 'Soumissions', 'Dernière activité', ''].map(h => (
                                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {['Fifamè Legba', 'Kodjo Mensah', 'Aicha Dembele', 'Moise Agossou', 'Clémence Ahloh'].map((name, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <td style={{ padding: '12px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                                            <span style={{ fontSize: 14 }}>{name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>{i % 2 === 0 ? '2/3 soumis' : '1/3 soumis'}</td>
                                    <td style={{ padding: '12px 20px', fontSize: 13, color: 'var(--text-muted)' }}>Il y a {['3h', '1j', '30min', '2j', '5h'][i]}</td>
                                    <td style={{ padding: '12px 20px' }}>
                                        <button className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>Voir détails</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
