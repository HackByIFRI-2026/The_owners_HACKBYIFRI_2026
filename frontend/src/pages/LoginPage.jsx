import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard'); // placeholder
        }, 1500);
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5001/api/v1/auth/google';
    };

    return (
        <div className="min-h-[calc(100vh-var(--topbar-height))] flex items-center justify-center py-12 px-6 bg-void relative">

            {/* Background structural grid */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="card rounded-sm border-white/10 bg-surface/90 backdrop-blur-md p-8 sm:p-10 shadow-lg relative overflow-hidden">

                    {/* Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber to-amber-light"></div>

                    <div className="text-center mb-10">
                        <div className="flex justify-center text-amber mb-6">
                            <BookOpen size={40} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-display text-primary tracking-wide">Portail d'Accès</h2>
                        <p className="mt-3 text-xs font-mono text-secondary uppercase tracking-widest">
                            Identification requise
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="input-group">
                                <label htmlFor="email" className="input-label">Identifiant Académique</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    placeholder="etudiant@kplon-nu.bj"
                                />
                            </div>

                            <div className="input-group">
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="password" className="input-label mb-0">Code de sécurité</label>
                                    <a href="#" className="text-xs font-mono text-amber hover:text-amber-light transition-colors">Restauration ?</a>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field font-mono"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full justify-center py-3 text-base mt-4 font-mono group"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin h-5 w-5 text-void" />
                            ) : (
                                <>
                                    Authentifier l'accès
                                    <ArrowRight className="h-4 w-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="my-8 flex items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-xs font-mono text-muted uppercase">Protocoles alternatifs</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="btn btn-secondary w-full justify-center py-3 bg-raised border-white/5 hover:border-amber/30 text-sm font-mono transition-all"
                    >
                        <svg className="h-4 w-4 mr-3" aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                            <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                            <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                            <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                        </svg>
                        Google OAuth
                    </button>

                    <p className="mt-8 text-center text-xs font-mono text-muted">
                        Non matriculé ?{' '}
                        <Link to="/register" className="text-amber hover:text-amber-light underline-offset-4 hover:underline transition-colors">
                            Initier l'admission
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
