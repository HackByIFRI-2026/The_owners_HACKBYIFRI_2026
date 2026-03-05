import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, School, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { authService } from '../services/services';
import toast from 'react-hot-toast';

export default function CompleteProfilePage() {
    const { user, setAuth } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('STUDENT');
    const [formData, setFormData] = useState({
        studentId: '',
        studyYear: '1',
        major: '',
        expertiseField: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = role === 'STUDENT'
                ? { role, studentId: formData.studentId, studyYear: parseInt(formData.studyYear), majors: [formData.major] }
                : { role, expertiseField: formData.expertiseField };

            // In a real app we would call an endpoint like /auth/complete-profile
            // For the hackathon demo, we simulate and update local state
            const updatedUser = { ...user, ...payload, isProfileComplete: true };
            setAuth(updatedUser, localStorage.getItem('token'));

            toast.success('Profil complété !');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Erreur lors de la finalisation du profil');
        } finally {
            setLoading(true);
        }
    };

    return (
        <div className="min-h-screen bg-void flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="card max-w-md w-full p-8 bg-surface border-white/5 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-amber/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber/20">
                        <User size={32} className="text-amber" />
                    </div>
                    <h2 className="text-2xl font-display text-primary mb-2">Finaliser votre profil</h2>
                    <p className="text-secondary text-sm">Quelques dernières informations pour personnaliser votre expérience.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button" onClick={() => setRole('STUDENT')}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'STUDENT' ? 'border-amber bg-amber/5' : 'border-white/5 bg-raised opacity-60'}`}
                        >
                            <GraduationCap size={24} className={role === 'STUDENT' ? 'text-amber' : 'text-muted'} />
                            <span className="text-xs font-bold uppercase tracking-wider">Étudiant</span>
                        </button>
                        <button
                            type="button" onClick={() => setRole('PROFESSOR')}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'PROFESSOR' ? 'border-violet bg-violet/5' : 'border-white/5 bg-raised opacity-60'}`}
                        >
                            <School size={24} className={role === 'PROFESSOR' ? 'text-violet' : 'text-muted'} />
                            <span className="text-xs font-bold uppercase tracking-wider">Professeur</span>
                        </button>
                    </div>

                    {role === 'STUDENT' ? (
                        <>
                            <div className="input-group">
                                <label className="input-label">Numéro Matricule</label>
                                <input
                                    className="input-field" placeholder="Ex: 12345678" required
                                    value={formData.studentId} onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="input-group">
                                    <label className="input-label">Année d'étude</label>
                                    <select
                                        className="input-field" value={formData.studyYear}
                                        onChange={e => setFormData({ ...formData, studyYear: e.target.value })}
                                    >
                                        <option value="1">Licence 1</option>
                                        <option value="2">Licence 2</option>
                                        <option value="3">Licence 3</option>
                                        <option value="4">Master 1</option>
                                        <option value="5">Master 2</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Filière</label>
                                    <input
                                        className="input-field" placeholder="Ex: GL, WIM, RT..." required
                                        value={formData.major} onChange={e => setFormData({ ...formData, major: e.target.value })}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="input-group">
                            <label className="input-label">Domaine d'expertise</label>
                            <input
                                className="input-field" placeholder="Ex: Algorithmique, Intelligence Artificielle..." required
                                value={formData.expertiseField} onChange={e => setFormData({ ...formData, expertiseField: e.target.value })}
                            />
                        </div>
                    )}

                    <button disabled={loading} className="btn btn-primary btn-full group">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : (
                            <>
                                Finaliser mon compte
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
