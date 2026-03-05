import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ArrowRight, Loader2, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

const DEMO_ACCOUNTS = [
    { label: 'Démo Étudiant', email: 'demo.etudiant@kplon-nu.bj', password: 'demo1234', color: 'var(--amber)' },
    { label: 'Démo Professeur', email: 'demo.prof@kplon-nu.bj', password: 'demo1234', color: 'var(--jade)' },
];

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) navigate(from, { replace: true });
    };

    const fillDemo = (acc) => {
        setEmail(acc.email);
        setPassword(acc.password);
    };

    const handleGoogle = () => {
        window.location.href = 'http://localhost:5002/api/v1/auth/google';
    };

    return (
        <div className="min-h-[calc(100vh-var(--topbar-height))] flex items-center justify-center py-12 px-6 bg-void relative">
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <motion.div
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="card rounded-sm border-white/10 relative overflow-hidden" style={{ padding: '36px 40px' }}>
                    <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, var(--amber), var(--jade))' }} />

                    <div className="text-center mb-8">
                        <div style={{ width: 48, height: 48, background: 'var(--amber)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <GraduationCap size={24} color="white" />
                        </div>
                        <h2 className="text-3xl font-display text-primary tracking-wide">Portail d'Accès</h2>
                        <p className="mt-2 text-xs font-mono text-secondary uppercase tracking-widest">Identification requise</p>
                    </div>

                    {/* Demo buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
                        {DEMO_ACCOUNTS.map((a) => (
                            <button
                                key={a.email}
                                type="button"
                                onClick={() => fillDemo(a)}
                                style={{ padding: '9px 12px', borderRadius: 10, border: `1px solid var(--border)`, background: 'var(--bg-raised)', color: a.color, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                {a.label}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div style={{ background: 'var(--coral-glow)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--coral)', marginBottom: 16 }}>
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Identifiant Académique</label>
                            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="etudiant@kplon-nu.bj" />
                        </div>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <label className="input-label" style={{ marginBottom: 0 }}>Code de sécurité</label>
                                <a href="#" className="text-xs font-mono text-amber hover:text-amber-light transition-colors">Restauration ?</a>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input id="password" name="password" type={showPw ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field font-mono" placeholder="••••••••" style={{ paddingRight: 44 }} />
                                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="btn btn-primary btn-full btn-lg" style={{ marginTop: 8 }}>
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <> Authentifier l'accès <ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <div className="my-6 flex items-center">
                        <div className="flex-grow" style={{ height: 1, background: 'var(--border)' }} />
                        <span className="flex-shrink-0 mx-4 text-xs font-mono text-muted uppercase">ou</span>
                        <div className="flex-grow" style={{ height: 1, background: 'var(--border)' }} />
                    </div>

                    <button onClick={handleGoogle} className="btn btn-secondary btn-full" style={{ fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                            <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                            <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                            <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                        </svg>
                        Google OAuth
                    </button>

                    <p className="mt-6 text-center text-xs font-mono text-muted">
                        Non matriculé ?{' '}
                        <Link to="/register" className="text-amber hover:underline underline-offset-4 transition-colors">Initier l'admission</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
