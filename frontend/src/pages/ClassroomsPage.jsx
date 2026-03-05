import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { School, Key, PlusCircle, Users, Clock, Video, X, CheckCircle, Loader2, ArrowRight, ChevronRight, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { classroomService } from '../services/services';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const COLORS = ['var(--amber)', 'var(--jade)', 'var(--violet)', 'var(--coral)'];

function JoinModal({ onClose, onSuccess }) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handle = async () => {
        if (!code.trim()) { toast.error('Entrez un code d\'invitation'); return; }
        setLoading(true);
        try {
            await classroomService.joinClassroom(code.trim());
            toast.success('Demande envoyée ! En attente de validation du professeur.');
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Code invalide ou salle introuvable');
        } finally { setLoading(false); }
    };

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: 24 }}>
            <motion.div onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 32, width: '100%', maxWidth: 420 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Rejoindre une salle</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Entrez le code fourni par votre professeur</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
                </div>
                <div className="input-group">
                    <label className="input-label">Code d'invitation</label>
                    <input className="input-field" placeholder="Ex: ALGO-2024" value={code} onChange={e => setCode(e.target.value.toUpperCase())} style={{ fontFamily: 'var(--font-mono)', fontSize: 20, textAlign: 'center', letterSpacing: 3 }} onKeyDown={e => e.key === 'Enter' && handle()} autoFocus />
                </div>
                <button onClick={handle} disabled={loading} className="btn btn-primary btn-full btn-lg">
                    {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><ArrowRight size={16} /> Envoyer la demande</>}
                </button>
            </motion.div>
        </div>
    );
}

function CreateModal({ onClose, onSuccess }) {
    const [form, setForm] = useState({ name: '', subject: '', description: '' });
    const [loading, setLoading] = useState(false);

    const handle = async () => {
        if (!form.name || !form.subject) { toast.error('Nom et matière requis'); return; }
        setLoading(true);
        try {
            await classroomService.createClassroom(form);
            toast.success('Salle créée succès !');
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de la création');
        } finally { setLoading(false); }
    };

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: 24 }}>
            <motion.div onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 32, width: '100%', maxWidth: 480 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Créer une salle</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Un code d'invitation sera généré automatiquement</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
                </div>
                <div className="input-group">
                    <label className="input-label">Nom de la salle *</label>
                    <input className="input-field" placeholder="Algorithmique L2 — 2024" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
                </div>
                <div className="input-group">
                    <label className="input-label">Matière *</label>
                    <input className="input-field" placeholder="Informatique, Mathématiques..." value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
                </div>
                <div className="input-group">
                    <label className="input-label">Description</label>
                    <textarea className="input-field" placeholder="Décrivez l'objectif de cette salle..." rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <button onClick={handle} disabled={loading} className="btn btn-primary btn-full btn-lg">
                    {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><PlusCircle size={16} /> Créer la salle</>}
                </button>
            </motion.div>
        </div>
    );
}

export default function ClassroomsPage() {
    const { user } = useAuthStore();
    const isProfessor = user?.role === 'PROFESSOR';
    const [classrooms, setClassrooms] = useState([]);
    const [pending, setPending] = useState({});
    const [loading, setLoading] = useState(true);
    const [showJoin, setShowJoin] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const fn = isProfessor ? classroomService.getMyClassrooms : classroomService.getMyEnrollments;
            const { data } = await fn();
            const cls = data.data || [];
            setClassrooms(cls);
            if (isProfessor) {
                const pendingMap = {};
                await Promise.allSettled(cls.map(async (c) => {
                    const res = await classroomService.getPendingStudents(c._id);
                    pendingMap[c._id] = res.data.data || [];
                }));
                setPending(pendingMap);
            }
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { load(); }, [isProfessor]);

    const handleValidate = async (classroomId, studentIds, action) => {
        try {
            await classroomService.validateStudents(classroomId, studentIds, action);
            toast.success(action === 'ACCEPTED' ? 'Demande(s) acceptée(s) !' : 'Demande(s) refusée(s)');
            load();
        } catch { toast.error('Erreur lors de la validation'); }
    };

    const totalPending = Object.values(pending).flat().length;

    return (
        <div className="page-container">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
                        {isProfessor ? 'Mes salles de classe' : 'Mes salles de classe'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                        {loading ? 'Chargement...' : `${classrooms.length} salle${classrooms.length !== 1 ? 's' : ''}`}
                        {isProfessor && totalPending > 0 && <span style={{ color: 'var(--amber)', marginLeft: 12 }}>· {totalPending} demande{totalPending > 1 ? 's' : ''} en attente</span>}
                    </p>
                </div>
                {isProfessor
                    ? <button onClick={() => setShowCreate(true)} className="btn btn-primary"><PlusCircle size={16} /> Nouvelle salle</button>
                    : <button onClick={() => setShowJoin(true)} className="btn btn-primary"><Key size={16} /> Rejoindre une salle</button>
                }
            </div>

            {/* Classrooms grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                    {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 20 }} />)}
                </div>
            ) : classrooms.length === 0 ? (
                <div className="card" style={{ padding: 60, textAlign: 'center' }}>
                    <School size={48} style={{ marginBottom: 16, opacity: 0.2, display: 'block', margin: '0 auto 16px' }} />
                    <h3 style={{ marginBottom: 8 }}>Aucune salle pour l'instant</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                        {isProfessor ? 'Créez votre première salle de classe.' : 'Rejoignez une salle avec le code de votre professeur.'}
                    </p>
                    {isProfessor
                        ? <button onClick={() => setShowCreate(true)} className="btn btn-primary btn-sm"><PlusCircle size={14} /> Créer</button>
                        : <button onClick={() => setShowJoin(true)} className="btn btn-primary btn-sm"><Key size={14} /> Rejoindre</button>
                    }
                </div>
            ) : (
                <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                    {classrooms.map((cls, i) => {
                        const color = COLORS[i % COLORS.length];
                        const clsPending = pending[cls._id] || [];
                        return (
                            <motion.div key={cls._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card card-hover" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ height: 5, background: `linear-gradient(90deg, ${color}, ${color}60)` }} />
                                <div style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, lineHeight: 1.3 }}>{cls.name}</div>
                                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{cls.subject || cls.professor?.firstName}</div>
                                        </div>
                                        {cls.status === 'PENDING' && <span className="badge badge-amber" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> En attente</span>}
                                        {cls.status === 'ACCEPTED' && <span className="badge badge-jade" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={11} /> Inscrit</span>}
                                        {clsPending.length > 0 && <span className="badge badge-amber" style={{ fontSize: 11 }}>{clsPending.length} en attente</span>}
                                    </div>

                                    <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} /> {cls.studentsCount ?? cls.enrolledStudents?.length ?? '—'}</span>
                                    </div>

                                    {isProfessor && cls.inviteCode && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-raised)', borderRadius: 8, padding: '8px 12px', marginBottom: 14 }}>
                                            <Key size={12} color="var(--amber)" />
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--amber)', letterSpacing: 2, fontWeight: 700 }}>{cls.inviteCode}</span>
                                            <button onClick={() => { navigator.clipboard.writeText(cls.inviteCode); toast.success('Copié !'); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Copy size={12} /></button>
                                        </div>
                                    )}

                                    {isProfessor || cls.status === 'ACCEPTED' ? (
                                        <Link to={`/classrooms/${cls._id}`} className="btn btn-primary btn-sm btn-full" style={{ justifyContent: 'center' }}>
                                            {isProfessor ? 'Gérer' : 'Accéder'} <ChevronRight size={14} />
                                        </Link>
                                    ) : (
                                        <button disabled className="btn btn-secondary btn-sm btn-full" style={{ justifyContent: 'center', opacity: 0.6, cursor: 'not-allowed' }}>
                                            En attente d'approbation
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Pending approvals for professors */}
            {isProfessor && totalPending > 0 && (
                <div style={{ marginTop: 32 }}>
                    <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Clock size={18} color="var(--amber)" /> Demandes d'accès en attente</h3>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {classrooms.map(cls => {
                            const pend = pending[cls._id] || [];
                            if (pend.length === 0) return null;
                            return (
                                <div key={cls._id}>
                                    <div style={{ padding: '12px 20px', background: 'var(--bg-raised)', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{cls.name} — <span style={{ color: 'var(--amber)' }}>{pend.length} demande{pend.length > 1 ? 's' : ''}</span></span>
                                        <button onClick={() => handleValidate(cls._id, pend.map(s => s.student._id), 'ACCEPTED')} className="btn btn-primary btn-sm" style={{ padding: '4px 10px', fontSize: 12 }}>
                                            <CheckCircle size={13} /> Tout accepter
                                        </button>
                                    </div>
                                    {pend.map((enrollment) => {
                                        const studentUser = enrollment.student;
                                        if (!studentUser) return null; // Sécurité si user supprimé
                                        return (
                                            <div key={enrollment._id} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid var(--border)', gap: 12 }}>
                                                {studentUser.avatar ? (
                                                    <img src={studentUser.avatar} alt="Avatar" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
                                                        {(studentUser.firstName?.[0] || '') + (studentUser.lastName?.[0] || '')}
                                                    </div>
                                                )}
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 14, fontWeight: 500 }}>{studentUser.firstName} {studentUser.lastName}</div>
                                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{studentUser.email}</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button onClick={() => toast((t) => (
                                                        <div style={{ padding: 8, minWidth: 280 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                                                {studentUser.avatar ? (
                                                                    <img src={studentUser.avatar} alt="Avatar" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                                                                ) : (
                                                                    <div className="avatar" style={{ width: 48, height: 48, fontSize: 16 }}>{(studentUser.firstName?.[0] || '') + (studentUser.lastName?.[0] || '')}</div>
                                                                )}
                                                                <div>
                                                                    <div style={{ fontWeight: 700 }}>{studentUser.firstName} {studentUser.lastName}</div>
                                                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{studentUser.email}</div>
                                                                </div>
                                                            </div>
                                                            <div style={{ background: 'var(--bg-deep)', padding: 12, borderRadius: 8, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Matricule:</span> <span>{studentUser.studentId || 'Non renseigné'}</span></div>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Année:</span> <span>{studentUser.studyYear || 'Non renseigné'}</span></div>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Filière(s):</span> <span>{studentUser.majors?.join(', ') || 'Non renseigné'}</span></div>
                                                            </div>
                                                            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                                                                <button onClick={() => { handleValidate(cls._id, [studentUser._id], 'REJECTED'); toast.dismiss(t.id); }} className="btn btn-danger btn-sm" style={{ flex: 1 }}><X size={13} /> Refuser</button>
                                                                <button onClick={() => { handleValidate(cls._id, [studentUser._id], 'ACCEPTED'); toast.dismiss(t.id); }} className="btn btn-jade btn-sm" style={{ flex: 1 }}><CheckCircle size={13} /> Accepter</button>
                                                            </div>
                                                        </div>
                                                    ), { duration: Infinity })} className="btn btn-secondary btn-sm"><ArrowRight size={13} /> Profil</button>
                                                    <button onClick={() => handleValidate(cls._id, [studentUser._id], 'REJECTED')} className="btn btn-danger btn-sm"><X size={13} /></button>
                                                    <button onClick={() => handleValidate(cls._id, [studentUser._id], 'ACCEPTED')} className="btn btn-jade btn-sm"><CheckCircle size={13} /></button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {showJoin && <JoinModal onClose={() => setShowJoin(false)} onSuccess={load} />}
            {showCreate && <CreateModal onClose={() => setShowCreate(false)} onSuccess={load} />}
        </div>
    );
}
