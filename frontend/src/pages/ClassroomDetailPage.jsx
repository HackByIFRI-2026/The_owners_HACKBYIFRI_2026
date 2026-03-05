import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    BookOpen, Video, Code, Users, Calendar, Clock,
    ChevronRight, Plus, Mail, CheckCircle, XCircle,
    ArrowLeft, Send, FileText, Download, Upload,
    MoreVertical, Trash2, Edit, X, Loader2, LinkIcon,
    Globe, Eye, ExternalLink
} from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import Avatar from '../components/Avatar';
import { courseService, exerciseService, sessionService, classroomService } from '../services/services';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const TABS = ['Cours', 'Exercices', 'Sessions live'];
const PROF_TABS = ['Cours', 'Exercices', 'Sessions live', 'Étudiants'];

export default function ClassroomDetailPage() {
    const { id } = useParams();
    const { user } = useAuthStore();
    const isProfessor = user?.role === 'PROFESSOR';
    const [activeTab, setActiveTab] = useState(0);
    const [classroom, setClassroom] = useState(null);
    const [courses, setCourses] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Modals
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [courseForm, setCourseForm] = useState({ title: '', description: '', type: 'TEXT', textContent: '', file: null });

    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [exerciseForm, setExerciseForm] = useState({ title: '', instructions: '', type: 'HOMEWORK', dueDate: '', file: null });

    const [showSessionModal, setShowSessionModal] = useState(false);
    const [sessionForm, setSessionForm] = useState({ title: '', scheduledStart: '', durationHours: 1 });

    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [submissionForm, setSubmissionForm] = useState({ type: 'FILE', file: null, linkUrl: '', linkType: 'GITHUB' });
    const [selectedExercise, setSelectedExercise] = useState(null);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailItem, setDetailItem] = useState(null);
    const [detailType, setDetailType] = useState(null); // 'COURSE' or 'EXERCISE'

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';
    const BASE_URL = API_URL.split('/api/v1')[0].replace(/\/$/, '');

    const getFullUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('blob:')) return url;
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${BASE_URL}${cleanUrl}`;
    };

    const tabs = isProfessor ? PROF_TABS : TABS;

    const loadData = () => {
        setLoading(true);
        Promise.allSettled([
            classroomService.getClassroom(id).then(({ data }) => setClassroom(data.data)),
            courseService.getCourses(id).then(({ data }) => setCourses(data.data || [])),
            exerciseService.getExercises(id).then(({ data }) => setExercises(data.data || [])),
            sessionService.getSessions(id).then(({ data }) => setSessions(data.data || [])),
        ]).finally(() => setLoading(false));
    };

    useEffect(() => { loadData(); }, [id]);

    const handleOpenDetail = (item, type) => {
        setDetailItem(item);
        setDetailType(type);
        setShowDetailModal(true);
    };

    const handleOpenSubmission = (exercise) => {
        setSelectedExercise(exercise);
        setShowSubmissionModal(true);
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('title', courseForm.title);
            formData.append('description', courseForm.description);
            formData.append('type', courseForm.type);

            if (courseForm.type === 'TEXT') formData.append('textContent', courseForm.textContent);
            if (courseForm.type === 'PDF' && courseForm.file) formData.append('file', courseForm.file);

            await courseService.publishCourse(id, formData);
            toast.success('Cours publié !');
            setShowCourseModal(false);
            setCourseForm({ title: '', description: '', type: 'TEXT', textContent: '', file: null });
            loadData();
        } catch (err) { toast.error(err.response?.data?.message || 'Erreur lors de la publication'); }
        finally { setIsSaving(false); }
    };

    const handleCreateExercise = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('title', exerciseForm.title);
            formData.append('instructions', exerciseForm.instructions);
            formData.append('type', exerciseForm.type);
            if (exerciseForm.dueDate) formData.append('dueDate', exerciseForm.dueDate);
            if (exerciseForm.file) formData.append('file', exerciseForm.file);

            await exerciseService.createExercise(id, formData);
            toast.success('Exercice publié !');
            setShowExerciseModal(false);
            setExerciseForm({ title: '', instructions: '', type: 'HOMEWORK', dueDate: '', file: null });
            loadData();
        } catch (err) { toast.error(err.response?.data?.message || 'Erreur lors de la publication'); }
        finally { setIsSaving(false); }
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const start = new Date(sessionForm.scheduledStart);
            const end = new Date(start.getTime() + sessionForm.durationHours * 60 * 60 * 1000);

            await sessionService.createSession(id, {
                title: sessionForm.title,
                scheduledStart: sessionForm.scheduledStart,
                scheduledEnd: end.toISOString()
            });

            toast.success('Session planifiée !');
            setShowSessionModal(false);
            setSessionForm({ title: '', scheduledStart: '', durationHours: 1 });
            loadData();
        } catch (err) { toast.error(err.response?.data?.message || 'Erreur lors de la création'); }
        finally { setIsSaving(false); }
    };

    const handleCreateSubmission = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const fd = new FormData();
            if (submissionForm.type === 'FILE') {
                if (!submissionForm.file) throw new Error('Veuillez sélectionner un fichier');
                fd.append('file', submissionForm.file);
            } else {
                if (!submissionForm.linkUrl) throw new Error('Veuillez entrer un lien');
                fd.append('linkUrl', submissionForm.linkUrl);
                fd.append('linkType', submissionForm.linkType);
            }

            await exerciseService.submitExercise(id, selectedExercise._id, fd);
            toast.success('Travail soumis avec succès !');
            setShowSubmissionModal(false);
            setSubmissionForm({ type: 'FILE', file: null, linkUrl: '', linkType: 'GITHUB' });
            loadData();
        } catch (err) {
            toast.error(err.message || err.response?.data?.message || 'Erreur lors de la soumission');
        } finally { setIsSaving(false); }
    };

    const handleStartSession = async (sessionId) => {
        try {
            await sessionService.startSession(sessionId);
            toast.success('Session démarrée !');
            loadData();
        } catch { toast.error('Impossible de démarrer la session'); }
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 16 }} />)}
        </div>
    );

    return (
        <div className="page-container" style={{ paddingBottom: 100 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Link to="/classrooms" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none' }}>
                    <ArrowLeft size={14} /> Mes salles
                </Link>
                {classroom && (
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ fontSize: 20, margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>{classroom.name}</h2>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Code : <span style={{ color: 'var(--amber)', fontWeight: 600 }}>{classroom.inviteCode}</span></div>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
                {tabs.map((tab, i) => (
                    <button key={tab} onClick={() => setActiveTab(i)} style={{
                        padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: activeTab === i ? 600 : 400,
                        color: activeTab === i ? 'var(--amber)' : 'var(--text-secondary)',
                        borderBottom: `2px solid ${activeTab === i ? 'var(--amber)' : 'transparent'}`,
                        marginBottom: -1, transition: 'all 0.2s',
                    }}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ marginBottom: 40 }}>
                {/* Courses Tab */}
                {activeTab === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {isProfessor && (
                            <button className="btn btn-secondary btn-sm" style={{ width: 'fit-content', marginBottom: 8 }} onClick={() => setShowCourseModal(true)}>
                                <Plus size={14} /> Publier un cours
                            </button>
                        )}
                        {courses.length === 0 ? (
                            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                                <BookOpen size={40} style={{ opacity: 0.2, display: 'block', margin: '0 auto 12px' }} />
                                <div style={{ fontSize: 15, marginBottom: 8 }}>Aucun cours publié</div>
                            </div>
                        ) : courses.map(c => (
                            <div key={c._id} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: c.type === 'PDF' ? 'rgba(255,107,107,0.15)' : 'rgba(0,201,167,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {c.type === 'PDF' ? <FileText size={18} color="var(--coral)" /> : <BookOpen size={18} color="var(--jade)" />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{c.title}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{c.description}</div>
                                    <span className={`badge ${c.type === 'PDF' ? 'badge-coral' : 'badge-jade'}`} style={{ fontSize: 10 }}>{c.type}</span>
                                </div>
                                <button onClick={() => handleOpenDetail(c, 'COURSE')} className="btn btn-secondary btn-sm">
                                    <Eye size={13} /> Lire le cours
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Exercises Tab */}
                {activeTab === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {isProfessor && (
                            <button className="btn btn-secondary btn-sm" style={{ width: 'fit-content', marginBottom: 8 }} onClick={() => setShowExerciseModal(true)}>
                                <Plus size={14} /> Créer un exercice
                            </button>
                        )}
                        {exercises.length === 0 ? (
                            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                                <Code size={40} style={{ opacity: 0.2, display: 'block', margin: '0 auto 12px' }} />
                                <div>Aucun exercice pour le moment</div>
                            </div>
                        ) : exercises.map(ex => (
                            <div key={ex._id} className="card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{ex.title}</div>
                                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, maxWidth: 600 }}>{ex.instructions.substring(0, 150)}{ex.instructions.length > 150 ? '...' : ''}</div>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            {ex.dueDate && (
                                                <span style={{ fontSize: 12, color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Clock size={11} /> Limite : {new Date(ex.dueDate).toLocaleDateString('fr-FR')}
                                                </span>
                                            )}
                                            <span className="badge badge-coral" style={{ fontSize: 10 }}>{ex.type}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                        <button onClick={() => handleOpenDetail(ex, 'EXERCISE')} className="btn btn-secondary btn-sm">
                                            <Eye size={13} /> Détails
                                        </button>
                                        {!isProfessor && (
                                            <button onClick={() => handleOpenSubmission(ex)} className="btn btn-primary btn-sm">
                                                <Upload size={13} /> Soumettre
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Sessions Tab */}
                {activeTab === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {isProfessor && (
                            <button className="btn btn-secondary btn-sm" style={{ width: 'fit-content', marginBottom: 8 }} onClick={() => setShowSessionModal(true)}>
                                <Plus size={14} /> Planifier un live
                            </button>
                        )}
                        {sessions.length === 0 ? (
                            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                                <Video size={40} style={{ opacity: 0.2, display: 'block', margin: '0 auto 12px' }} />
                                <div>Aucune session planifiée</div>
                            </div>
                        ) : sessions.map(s => (
                            <div key={s._id} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: s.status === 'LIVE' ? 'rgba(255,107,107,0.15)' : 'rgba(0,201,167,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Video size={18} color={s.status === 'LIVE' ? 'var(--coral)' : 'var(--jade)'} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                        {s.scheduledStart ? new Date(s.scheduledStart).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : 'Maintenant'}
                                    </div>
                                </div>
                                {s.status === 'LIVE' && !isProfessor && (
                                    <a href={s.meetingUrl} target="_blank" rel="noreferrer" className="btn btn-danger btn-sm shadow-lg shadow-coral/20">Rejoindre LIVE</a>
                                )}
                                {isProfessor && s.status === 'SCHEDULED' && (
                                    <button onClick={() => handleStartSession(s._id)} className="btn btn-primary btn-sm"><Video size={13} /> Démarrer</button>
                                )}
                                {(s.status === 'ENDED' || s.status === 'COMPLETED') && (
                                    <span className="badge badge-muted" style={{ fontSize: 11 }}>Terminée</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Students Tab (Professor Only) */}
                {activeTab === 3 && isProfessor && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                        {!classroom?.students || classroom.students.filter(s => s.status === 'ACCEPTED').length === 0 ? (
                            <div className="card shadow-md" style={{ gridColumn: '1 / -1', padding: 48, textAlign: 'center', border: '2px dashed var(--border)' }}>
                                <Users size={40} style={{ opacity: 0.2, display: 'block', margin: '0 auto 12px' }} />
                                <div style={{ color: 'var(--text-muted)' }}>Aucun étudiant accepté dans cette salle</div>
                            </div>
                        ) : (
                            classroom.students.filter(s => s.status === 'ACCEPTED').map(enrollment => {
                                const studentUser = enrollment.student;
                                if (!studentUser) return null;
                                const avatarPath = studentUser.avatar?.startsWith('http') ? studentUser.avatar : `${BASE_URL}${studentUser.avatar}`;
                                return (
                                    <div key={enrollment._id} className="card hover-raised" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <Avatar src={studentUser.avatar} firstName={studentUser.firstName} lastName={studentUser.lastName} size={48} className="border-2 border-border" />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{studentUser.firstName} {studentUser.lastName}</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{studentUser.email}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '12px', background: 'var(--bg-raised)', borderRadius: 12, border: '1px solid var(--border)' }}>
                                            <div>
                                                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 2 }}>ID Étudiant</div>
                                                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{studentUser.studentId || '-'}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 2 }}>Année</div>
                                                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{studentUser.studyYear || '-'}</div>
                                            </div>
                                            <div style={{ gridColumn: 'span 2', marginTop: 4 }}>
                                                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 2 }}>Filière</div>
                                                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--amber)' }}>{studentUser.majors?.[0] || '-'}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Modals Section */}

            {/* Course Modal */}
            {showCourseModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
                    <div className="card shadow-2xl" style={{ width: '100%', maxWidth: 550, padding: 0, maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-bright)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-raised)' }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-jade/10 text-jade"><BookOpen size={20} /></div>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Publier un nouveau cours</h3>
                            </div>
                            <button onClick={() => setShowCourseModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateCourse} className="p-6 flex flex-col gap-5">
                            <div>
                                <label className="input-label">Titre du cours</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 text-muted" size={16} />
                                    <input type="text" className="input-field pl-10" placeholder="ex: Introduction au JavaScript" required value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Description courte</label>
                                <input type="text" className="input-field" placeholder="Décrivez brièvement le contenu du cours" value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div onClick={() => setCourseForm({ ...courseForm, type: 'TEXT' })} className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${courseForm.type === 'TEXT' ? 'border-amber bg-amber/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}>
                                    <div className={`mb-2 ${courseForm.type === 'TEXT' ? 'text-amber' : 'text-muted'}`}><FileText size={24} /></div>
                                    <div className="font-bold text-sm">Texte direct</div>
                                    <div className="text-[10px] text-muted">Éditeur Markdown</div>
                                </div>
                                <div onClick={() => setCourseForm({ ...courseForm, type: 'PDF' })} className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${courseForm.type === 'PDF' ? 'border-amber bg-amber/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}>
                                    <div className={`mb-2 ${courseForm.type === 'PDF' ? 'text-amber' : 'text-muted'}`}><Upload size={24} /></div>
                                    <div className="font-bold text-sm">Fichier PDF</div>
                                    <div className="text-[10px] text-muted">Upload de document</div>
                                </div>
                            </div>

                            {courseForm.type === 'TEXT' ? (
                                <div>
                                    <label className="input-label">Contenu du cours</label>
                                    <textarea className="input-field" rows="6" placeholder="Rédigez votre cours ici (Markdown supporté)..." required value={courseForm.textContent} onChange={e => setCourseForm({ ...courseForm, textContent: e.target.value })} />
                                </div>
                            ) : (
                                <div>
                                    <label className="input-label">Fichier PDF</label>
                                    <div className="input-file-upload">
                                        <input type="file" accept="application/pdf" className="hidden" id="pdf-upload" required={courseForm.type === 'PDF'} onChange={e => setCourseForm({ ...courseForm, file: e.target.files[0] })} />
                                        <label htmlFor="pdf-upload" className="input-file-upload-label">
                                            <Upload className="mx-auto mb-3 text-muted" size={32} />
                                            <div className="text-sm font-medium mb-1">{courseForm.file ? courseForm.file.name : 'Cliquez pour sélectionner le PDF'}</div>
                                            <div className="text-xs text-muted mb-4">Taille max : 10 Mo</div>
                                            <span className="btn btn-secondary btn-sm cursor-pointer inline-flex">
                                                {courseForm.file ? 'Changer le fichier' : 'Choisir un fichier'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowCourseModal(false)} className="btn btn-secondary flex-1">Annuler</button>
                                <button type="submit" disabled={isSaving} className="btn btn-primary flex-1 py-3 shadow-lg shadow-amber/20">
                                    {isSaving ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Publier le cours'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Exercise Modal */}
            {showExerciseModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
                    <div className="card shadow-2xl" style={{ width: '100%', maxWidth: 550, padding: 0, maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-bright)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-raised)' }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-coral/10 text-coral"><Code size={20} /></div>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Nouvel exercice / TP</h3>
                            </div>
                            <button onClick={() => setShowExerciseModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateExercise} className="p-6 flex flex-col gap-5">
                            <div>
                                <label className="input-label">Intitulé de l'exercice</label>
                                <input type="text" className="input-field" placeholder="ex: TP n°1 - Algorithmique" required value={exerciseForm.title} onChange={e => setExerciseForm({ ...exerciseForm, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="input-label">Instructions pour les étudiants</label>
                                <textarea className="input-field" rows="4" placeholder="Détaillez ce qui est attendu (Markdown supporté)..." required value={exerciseForm.instructions} onChange={e => setExerciseForm({ ...exerciseForm, instructions: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="input-label">Catégorie</label>
                                    <select className="input-field" value={exerciseForm.type} onChange={e => setExerciseForm({ ...exerciseForm, type: e.target.value })}>
                                        <option value="HOMEWORK">Devoir maison</option>
                                        <option value="PROJECT">Projet</option>
                                        <option value="EXAM">Examen</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="input-label">Date limite</label>
                                    <input type="date" className="input-field" value={exerciseForm.dueDate} onChange={e => setExerciseForm({ ...exerciseForm, dueDate: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Support ou énoncé (Optionnel)</label>
                                <div className="input-file-upload">
                                    <input type="file" className="hidden" id="exercise-file" onChange={e => setExerciseForm({ ...exerciseForm, file: e.target.files[0] })} />
                                    <label htmlFor="exercise-file" className="input-file-upload-label">
                                        <Upload className="mx-auto mb-3 text-muted" size={32} />
                                        <div className="text-sm font-medium">{exerciseForm.file ? exerciseForm.file.name : 'Choisir un fichier'}</div>
                                        <div className="text-xs text-muted">PDF, ZIP ou Image supportés</div>
                                        <span className="btn btn-secondary btn-sm cursor-pointer inline-flex mt-3">
                                            {exerciseForm.file ? 'Changer le fichier' : 'Sélectionner'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowExerciseModal(false)} className="btn btn-secondary flex-1">Annuler</button>
                                <button type="submit" disabled={isSaving} className="btn btn-primary flex-1 py-3 shadow-lg shadow-amber/20">
                                    {isSaving ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Créer l'exercice"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Session Modal */}
            {showSessionModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
                    <div className="card shadow-2xl" style={{ width: '100%', maxWidth: 500, padding: 0, maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-bright)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-raised)' }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber/10 text-amber"><Video size={20} /></div>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Planifier une session Live</h3>
                            </div>
                            <button onClick={() => setShowSessionModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateSession} className="p-6 flex flex-col gap-5">
                            <div>
                                <label className="input-label">Sujet du Live</label>
                                <input type="text" className="input-field" placeholder="ex: Séance de Q&A sur les boucles" required value={sessionForm.title} onChange={e => setSessionForm({ ...sessionForm, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="input-label">Date et heure de début</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 text-muted" size={16} />
                                        <input type="datetime-local" className="input-field pl-10" required value={sessionForm.scheduledStart} onChange={e => setSessionForm({ ...sessionForm, scheduledStart: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="input-label">Durée (Heures)</label>
                                    <select className="input-field" value={sessionForm.durationHours} onChange={e => setSessionForm({ ...sessionForm, durationHours: parseInt(e.target.value) })}>
                                        <option value={1}>1 Heure</option>
                                        <option value={2}>2 Heures</option>
                                        <option value={3}>3 Heures</option>
                                        <option value={4}>4 Heures</option>
                                    </select>
                                </div>
                            </div>
                            <div className="text-[10px] text-muted mt-2 bg-amber/5 p-2 rounded border border-amber/10">
                                Note : Un lien de réunion automatique sera généré pour vous et vos étudiants.
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowSessionModal(false)} className="btn btn-secondary flex-1">Annuler</button>
                                <button type="submit" disabled={isSaving} className="btn btn-primary flex-1 py-3 shadow-lg shadow-amber/20">
                                    {isSaving ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Planifier maintenant"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Submission Modal */}
            {showSubmissionModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
                    <div className="card shadow-2xl" style={{ width: '100%', maxWidth: 500, padding: 0, border: '1px solid var(--border-bright)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-raised)' }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-jade/10 text-jade"><CheckCircle size={20} /></div>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Soumettre mon travail</h3>
                            </div>
                            <button onClick={() => setShowSubmissionModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateSubmission} className="p-6 flex flex-col gap-5">
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                Soumission pour : <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedExercise?.title}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div onClick={() => setSubmissionForm({ ...submissionForm, type: 'FILE' })} className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${submissionForm.type === 'FILE' ? 'border-amber bg-amber/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}>
                                    <div className={`mb-2 ${submissionForm.type === 'FILE' ? 'text-amber' : 'text-muted'}`}><Upload size={24} /></div>
                                    <div className="font-bold text-sm">Fichier ZIP/PDF</div>
                                </div>
                                <div onClick={() => setSubmissionForm({ ...submissionForm, type: 'LINK' })} className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${submissionForm.type === 'LINK' ? 'border-amber bg-amber/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}>
                                    <div className={`mb-2 ${submissionForm.type === 'LINK' ? 'text-amber' : 'text-muted'}`}><LinkIcon size={24} /></div>
                                    <div className="font-bold text-sm">Lien GitHub/Drive</div>
                                </div>
                            </div>

                            {submissionForm.type === 'FILE' ? (
                                <div className="input-file-upload">
                                    <input type="file" className="hidden" id="submission-file" onChange={e => setSubmissionForm({ ...submissionForm, file: e.target.files[0] })} />
                                    <label htmlFor="submission-file" className="input-file-upload-label">
                                        <Upload className="mx-auto mb-3 text-muted" size={32} />
                                        <div className="text-sm font-medium">{submissionForm.file ? submissionForm.file.name : 'Choisir votre fichier'}</div>
                                        <span className="btn btn-secondary btn-sm cursor-pointer inline-flex mt-3">Sélectionner</span>
                                    </label>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="input-label">Type de lien</label>
                                        <select className="input-field" value={submissionForm.linkType} onChange={e => setSubmissionForm({ ...submissionForm, linkType: e.target.value })}>
                                            <option value="GITHUB">GitHub Repository</option>
                                            <option value="DRIVE">Google Drive</option>
                                            <option value="OTHER">Autre lien</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="input-label">URL du projet</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3 text-muted" size={16} />
                                            <input type="url" className="input-field pl-10" placeholder="https://github.com/profile/repo" required value={submissionForm.linkUrl} onChange={e => setSubmissionForm({ ...submissionForm, linkUrl: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowSubmissionModal(false)} className="btn btn-secondary flex-1">Annuler</button>
                                <button type="submit" disabled={isSaving} className="btn btn-primary flex-1 py-3 shadow-lg shadow-amber/20">
                                    {isSaving ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Envoyer ma soumission"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Detailed View Modal (Course/Exercise) */}
            {showDetailModal && detailItem && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
                    <div className="card shadow-2xl" style={{ width: '100%', maxWidth: 900, padding: 0, maxHeight: '95vh', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-bright)', overflow: 'hidden' }}>
                        {/* Header */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-raised)' }}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${detailType === 'COURSE' ? 'bg-jade/10 text-jade' : 'bg-coral/10 text-coral'}`}>
                                    {detailType === 'COURSE' ? <BookOpen size={20} /> : <Code size={20} />}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{detailItem.title}</h3>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {detailType === 'COURSE' ? `Cours • ${detailItem.type}` : `Exercice • ${detailItem.type}`}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} style={{ border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 8, borderRadius: '50%', background: 'var(--bg-void)' }}><X size={20} /></button>
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }} className="custom-scrollbar">
                            {detailType === 'COURSE' ? (
                                <div>
                                    {detailItem.type === 'PDF' && detailItem.fileUrl ? (
                                        <div style={{ height: '600px', width: '100%', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-void)' }}>
                                            <iframe
                                                src={`${getFullUrl(detailItem.fileUrl)}#toolbar=0`}
                                                width="100%"
                                                height="100%"
                                                title={detailItem.title}
                                                style={{ border: 'none' }}
                                            />
                                        </div>
                                    ) : (
                                        <MarkdownRenderer content={detailItem.textContent || detailItem.description || ''} />
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-8">
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', marginBottom: 16 }}>Instructions</div>
                                        <MarkdownRenderer content={detailItem.instructions || ''} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {detailItem.dueDate && (
                                            <div className="p-4 rounded-xl bg-bg-raised border border-border flex items-center gap-4">
                                                <div className="p-2 rounded-lg bg-coral/10 text-coral"><Calendar size={20} /></div>
                                                <div>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Date limite</div>
                                                    <div style={{ fontWeight: 600 }}>{new Date(detailItem.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                                </div>
                                            </div>
                                        )}
                                        {detailItem.attachmentUrl && (
                                            <a
                                                href={detailItem.attachmentUrl?.startsWith('http') ? detailItem.attachmentUrl : `${BASE_URL}${detailItem.attachmentUrl}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-4 rounded-xl bg-bg-raised border border-border hover:border-jade/50 transition-colors flex items-center gap-4 text-inherit no-underline"
                                            >
                                                <div className="p-2 rounded-lg bg-jade/10 text-jade"><Download size={20} /></div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pièce jointe</div>
                                                    <div style={{ fontWeight: 600 }}>Télécharger l'énoncé</div>
                                                </div>
                                                <ExternalLink size={14} className="text-muted" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-raised)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                            <button onClick={() => setShowDetailModal(false)} className="btn btn-secondary">
                                Fermer
                            </button>
                            {detailType === 'EXERCISE' && !isProfessor && (
                                <button
                                    onClick={() => {
                                        setShowDetailModal(false);
                                        handleOpenSubmission(detailItem);
                                    }}
                                    className="btn btn-primary"
                                >
                                    <CheckCircle size={16} /> Soumettre mon travail
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
