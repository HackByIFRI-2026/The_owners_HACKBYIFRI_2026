import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { Users, BookOpen, PlusCircle, Key, CheckCircle, Clock, Video, X, Loader, ArrowRight, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_CLASSROOMS = [
    {
        id: 1,
        name: 'Algorithmique & Structures de Données L2',
        subject: 'Informatique',
        professor: 'Prof. Koffi Ahouant',
        studentsCount: 87,
        inviteCode: 'ALGO-2024',
        color: '#F0A500',
        coursesCount: 8,
        exercisesCount: 3,
        status: 'ACCEPTED',
        nextSession: 'Lun 10 Mars, 14h00',
        isLive: false,
    },
    {
        id: 2,
        name: 'Bases de Données Avancées L3',
        subject: 'Informatique',
        professor: 'Prof. Koffi Ahouant',
        studentsCount: 54,
        inviteCode: 'BDD-2024',
        color: '#00C9A7',
        coursesCount: 6,
        exercisesCount: 2,
        status: 'ACCEPTED',
        nextSession: 'Mar 11 Mars, 16h30',
        isLive: false,
    },
    {
        id: 3,
        name: 'React.js Avancé L3',
        subject: 'Développement Web',
        professor: 'Prof. Koffi Ahouant',
        studentsCount: 112,
        inviteCode: 'REACT-24',
        color: '#8B5CF6',
        coursesCount: 10,
        exercisesCount: 4,
        status: 'PENDING',
        nextSession: null,
        isLive: false,
    },
];

// Professor's own classrooms
const MY_CLASSROOMS_PROF = [
    { id: 1, name: 'Algorithmique L2', subject: 'Informatique', inviteCode: 'ALGO-2024', color: '#F0A500', studentsCount: 87, pendingCount: 3, isLive: false },
    { id: 2, name: 'Bases de Données L3', subject: 'Informatique', inviteCode: 'BDD-2024', color: '#00C9A7', studentsCount: 54, pendingCount: 0, isLive: true },
    { id: 3, name: 'React.js L3', subject: 'Web', inviteCode: 'REACT-24', color: '#8B5CF6', studentsCount: 112, pendingCount: 7, isLive: false },
];

function JoinModal({ onClose }) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = () => {
        if (!code.trim()) { toast.error('Entrez un code d\'invitation'); return; }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('Demande envoyée ! En attente de validation du professeur.');
            onClose();
        }, 1200);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: 24 }} onClick={onClose}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-xl)', padding: 32, width: '100%', maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Rejoindre une salle</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Entrez le code fourni par votre professeur</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><X size={20} /></button>
                </div>
                <div className="input-group">
                    <label className="input-label">Code d'invitation</label>
                    <input
                        className="input-field"
                        placeholder="Ex: ALGO-2024"
                        value={code}
                        onChange={e => setCode(e.target.value.toUpperCase())}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: 18, textAlign: 'center', letterSpacing: 3 }}
                        onKeyDown={e => e.key === 'Enter' && handleJoin()}
                    />
                </div>
                <button onClick={handleJoin} disabled={loading} className="btn btn-primary btn-full btn-lg">
                    {loading ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Envoi en cours...</> : <>Envoyer la demande <ArrowRight size={15} /></>}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, padding: 12, background: 'var(--amber-glow)', borderRadius: 'var(--radius-md)', border: '1px solid var(--amber-border)' }}>
                    <Key size={13} color="var(--amber)" />
                    <span style={{ fontSize: 12, color: 'var(--amber)' }}>Essayez : ALGO-2024, BDD-2024, REACT-24</span>
                </div>
            </div>
        </div>
    );
}

function CreateClassroomModal({ onClose }) {
    const [form, setForm] = useState({ name: '', subject: '', description: '' });
    const [loading, setLoading] = useState(false);

    const handleCreate = () => {
        if (!form.name || !form.subject) { toast.error('Remplissez les champs obligatoires'); return; }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('Salle créée ! Code : ' + form.name.split(' ')[0].toUpperCase().slice(0, 4) + '-2024');
            onClose();
        }, 1000);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: 24 }} onClick={onClose}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-xl)', padding: 32, width: '100%', maxWidth: 480 }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Créer une salle de classe</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Quota : 1/10 salles utilisées (plan gratuit)</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><X size={20} /></button>
                </div>
                <div className="input-group">
                    <label className="input-label">Nom de la salle *</label>
                    <input className="input-field" placeholder="Ex: Algorithmique L2 2024" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="input-group">
                    <label className="input-label">Matière *</label>
                    <input className="input-field" placeholder="Ex: Informatique, Mathématiques..." value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
                </div>
                <div className="input-group">
                    <label className="input-label">Description (optionnel)</label>
                    <textarea className="input-field" placeholder="Décrivez l'objectif de cette salle..." rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                {/* Quota bar */}
                <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                        <span>Capacité utilisée</span><span>1 / 10</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: '10%' }} /></div>
                </div>
                <button onClick={handleCreate} disabled={loading} className="btn btn-primary btn-full btn-lg">
                    {loading ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Création...</> : <>Créer la salle <ArrowRight size={15} /></>}
                </button>
            </div>
        </div>
    );
}

export default function ClassroomsPage() {
    const { user } = useAuth();
    const isProfessor = user?.role === 'professor';
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [pendingApproval, setPendingApproval] = useState({
        1: [
            { id: 1, name: 'Rostand Kpodo', email: 'rostand.k@gmail.com' },
            { id: 2, name: 'Aline Tonouvi', email: 'aline.t@gmail.com' },
            { id: 3, name: 'Marc Gbedo', email: 'marc.g@gmail.com' },
        ]
    });

    const handleValidate = (classroomId, studentId, action) => {
        setPendingApproval(prev => ({
            ...prev,
            [classroomId]: prev[classroomId]?.filter(s => s.id !== studentId) || [],
        }));
        toast.success(action === 'ACCEPTED' ? 'Étudiant accepté !' : 'Demande refusée');
    };

    const classrooms = isProfessor ? MY_CLASSROOMS_PROF : MOCK_CLASSROOMS;

    return (
        <div className="page-container">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
                        {isProfessor ? 'Mes salles de classe' : 'Mes salles de classe'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                        {isProfessor ? `${MY_CLASSROOMS_PROF.length} salles créées` : `${MOCK_CLASSROOMS.filter(c => c.status === 'ACCEPTED').length} salles actives`}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    {isProfessor ? (
                        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
                            <PlusCircle size={16} /> Nouvelle salle
                        </button>
                    ) : (
                        <button onClick={() => setShowJoinModal(true)} className="btn btn-primary">
                            <Key size={16} /> Rejoindre une salle
                        </button>
                    )}
                </div>
            </div>

            {/* Student: pending request banner */}
            {!isProfessor && MOCK_CLASSROOMS.some(c => c.status === 'PENDING') && (
                <div style={{
                    background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.2)',
                    borderRadius: 'var(--radius-md)', padding: '14px 20px', marginBottom: 24,
                    display: 'flex', alignItems: 'center', gap: 12,
                }}>
                    <Clock size={16} color="var(--amber)" />
                    <span style={{ fontSize: 14, color: 'var(--amber)' }}>
                        Vous avez une demande en attente de validation pour <strong>React.js L3</strong>.
                    </span>
                </div>
            )}

            {/* Classrooms grid */}
            <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20, marginBottom: 32 }}>
                {classrooms.map((classroom) => (
                    <div key={classroom.id} className={`card card-hover animate-fade-in`} style={{ padding: 0, overflow: 'hidden', opacity: !isProfessor && classroom.status === 'PENDING' ? 0.7 : 1 }}>
                        {/* Color header */}
                        <div style={{
                            height: 6,
                            background: `linear-gradient(90deg, ${classroom.color}, ${classroom.color}80)`,
                        }} />
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, lineHeight: 1.3 }}>{classroom.name}</div>
                                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{isProfessor ? classroom.subject : classroom.professor}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                                    {!isProfessor && (
                                        <span className={`badge ${classroom.status === 'ACCEPTED' ? 'badge-jade' : 'badge-amber'}`} style={{ fontSize: 11 }}>
                                            {classroom.status === 'ACCEPTED' ? '✓ Inscrit' : '⏳ En attente'}
                                        </span>
                                    )}
                                    {classroom.isLive && (
                                        <span className="badge badge-coral" style={{ fontSize: 11 }}>
                                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--coral)', display: 'inline-block', marginRight: 4 }} />
                                            LIVE
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Users size={13} /> {classroom.studentsCount} étudiants
                                </span>
                                {!isProfessor && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <BookOpen size={13} /> {classroom.coursesCount} cours
                                    </span>
                                )}
                                {isProfessor && classroom.pendingCount > 0 && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--amber)' }}>
                                        <Clock size={13} /> {classroom.pendingCount} en attente
                                    </span>
                                )}
                            </div>

                            {/* Invite code for professor */}
                            {isProfessor && (
                                <div style={{ background: 'var(--bg-raised)', borderRadius: 8, padding: '8px 12px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Key size={13} color="var(--amber)" />
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--amber)', letterSpacing: 2, fontWeight: 700 }}>{classroom.inviteCode}</span>
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(classroom.inviteCode); toast.success('Code copié !'); }}
                                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)' }}
                                    >
                                        Copier
                                    </button>
                                </div>
                            )}

                            {/* Next session */}
                            {!isProfessor && classroom.status === 'ACCEPTED' && classroom.nextSession && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: 13, color: 'var(--text-secondary)' }}>
                                    <Video size={13} color="var(--jade)" />
                                    <span>Prochain live : <strong style={{ color: 'var(--jade)' }}>{classroom.nextSession}</strong></span>
                                </div>
                            )}

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 8 }}>
                                {isProfessor ? (
                                    <>
                                        <Link to={`/classrooms/${classroom.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                                            Gérer <ChevronRight size={14} />
                                        </Link>
                                        {classroom.isLive ? (
                                            <button className="btn btn-danger btn-sm">Terminer le live</button>
                                        ) : (
                                            <button onClick={() => toast.success('Session live démarrée !')} className="btn btn-secondary btn-sm">
                                                <Video size={13} /> Lancer live
                                            </button>
                                        )}
                                    </>
                                ) : classroom.status === 'ACCEPTED' ? (
                                    <>
                                        <Link to={`/classrooms/${classroom.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                                            Accéder <ChevronRight size={14} />
                                        </Link>
                                        {classroom.isLive && (
                                            <button className="btn btn-danger btn-sm" style={{ gap: 6 }}>
                                                <Video size={13} /> Rejoindre live
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="btn btn-secondary btn-sm btn-full" style={{ justifyContent: 'center', opacity: 0.5, cursor: 'default' }}>
                                        En attente de validation
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty state */}
                {classrooms.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
                        <BookOpen size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                        <div style={{ fontSize: 16, marginBottom: 8 }}>Aucune salle de classe</div>
                        <div style={{ fontSize: 14, marginBottom: 24 }}>
                            {isProfessor ? 'Créez votre première salle en cliquant sur "Nouvelle salle"' : 'Rejoignez une salle avec le code fourni par votre professeur'}
                        </div>
                        {isProfessor ? (
                            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
                                <PlusCircle size={15} /> Créer une salle
                            </button>
                        ) : (
                            <button onClick={() => setShowJoinModal(true)} className="btn btn-primary">
                                <Key size={15} /> Rejoindre une salle
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Professor: Pending approvals section */}
            {isProfessor && Object.values(pendingApproval).flat().length > 0 && (
                <div>
                    <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
                        ⏳ Demandes d'accès en attente
                    </h3>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {MY_CLASSROOMS_PROF.map(classroom => {
                            const pending = pendingApproval[classroom.id] || [];
                            if (pending.length === 0) return null;
                            return (
                                <div key={classroom.id}>
                                    <div style={{ padding: '12px 20px', background: 'var(--bg-raised)', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, fontWeight: 600 }}>
                                        {classroom.name} — <span style={{ color: 'var(--amber)' }}>{pending.length} demande{pending.length > 1 ? 's' : ''}</span>
                                    </div>
                                    {pending.map(student => (
                                        <div key={student.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 12 }}>
                                            <div className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
                                                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 14, fontWeight: 500 }}>{student.name}</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{student.email}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button onClick={() => handleValidate(classroom.id, student.id, 'REJECTED')} className="btn btn-danger btn-sm"><X size={13} /> Refuser</button>
                                                <button onClick={() => handleValidate(classroom.id, student.id, 'ACCEPTED')} className="btn btn-jade btn-sm"><CheckCircle size={13} /> Accepter</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {showJoinModal && <JoinModal onClose={() => setShowJoinModal(false)} />}
            {showCreateModal && <CreateClassroomModal onClose={() => setShowCreateModal(false)} />}
        </div>
    );
}
