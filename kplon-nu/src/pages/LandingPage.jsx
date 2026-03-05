import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Brain, BookOpen, Users, Zap, Star, ArrowRight, Play, CheckCircle, TrendingUp, MessageSquare, Layers, Video } from 'lucide-react';

const STATS = [
    { value: '2 400+', label: 'Étudiants actifs', icon: Users },
    { value: '120+', label: 'Cours disponibles', icon: BookOpen },
    { value: '98%', label: 'de satisfaction', icon: Star },
    { value: '45+', label: 'Professeurs', icon: GraduationCap },
];

const FEATURES = [
    {
        icon: BookOpen,
        color: 'var(--amber)',
        title: 'Cours structurés',
        desc: 'Vidéos, PDFs et TPs publiés par vos professeurs, organisés par salle de classe.',
    },
    {
        icon: Brain,
        color: 'var(--violet)',
        title: 'Assistant IA Mɛsi',
        desc: 'Un tuteur intelligent qui vous guide sans jamais vous donner les réponses directement.',
    },
    {
        icon: Layers,
        color: 'var(--jade)',
        title: 'Flashcards & Quiz',
        desc: 'Révision par répétition espacée et quiz adaptatifs pour consolider vos acquis.',
    },
    {
        icon: Video,
        color: 'var(--coral)',
        title: 'Visioconférences',
        desc: 'Rejoignez les sessions en direct de vos professeurs depuis n\'importe où.',
    },
    {
        icon: TrendingUp,
        color: 'var(--jade)',
        title: 'Suivi de progression',
        desc: 'Tableau de bord personnalisé, streak quotidien et visualisation de vos forces.',
    },
    {
        icon: MessageSquare,
        color: 'var(--amber)',
        title: 'Collaboration',
        desc: 'Commentaires, réponses imbriquées et soumission de TPs directement sur la plateforme.',
    },
];

const TESTIMONIALS = [
    {
        name: 'Fifamè Legba',
        role: 'Étudiante en Informatique — UAC',
        text: 'Mɛsi m\'a aidée à comprendre la récursivité quand aucune explication ne passait. C\'est comme avoir un prof disponible 24h/24.',
        avatar: 'FL',
        stars: 5,
    },
    {
        name: 'Prof. Koffi Ahouant',
        role: 'Enseignant en Sciences Informatiques — UP',
        text: 'La plateforme me permet de suivre en temps réel la progression de mes 87 étudiants. Je sais exactement qui a besoin d\'aide.',
        avatar: 'KA',
        stars: 5,
    },
    {
        name: 'Kodjo Mensah',
        role: 'Étudiant en Licence 2 — UNSTIM',
        text: 'Le système de flashcards a révolutionné ma façon de réviser. Je mémorise deux fois plus vite maintenant.',
        avatar: 'KM',
        stars: 5,
    },
];

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div style={{ background: 'var(--bg-void)', minHeight: '100vh', overflowX: 'hidden' }}>

            {/* ---- NAV ---- */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
                padding: '0 32px',
                height: 64,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                background: scrolled ? 'rgba(8,12,16,0.92)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, background: 'var(--amber)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <GraduationCap size={18} color="var(--bg-void)" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)' }}>Kplɔ́n nǔ</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Link to="/login" className="btn btn-ghost btn-sm">Se connecter</Link>
                    <Link to="/register" className="btn btn-primary btn-sm">S'inscrire gratuitement</Link>
                </div>
            </nav>

            {/* ---- HERO ---- */}
            <section style={{
                minHeight: '100vh',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center',
                padding: '120px 24px 64px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Background glows */}
                <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '30%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '20%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,201,167,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />

                <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'var(--amber-glow)', border: '1px solid var(--amber-border)',
                        borderRadius: 100, padding: '6px 16px', marginBottom: 28,
                        fontSize: 13, color: 'var(--amber)', fontWeight: 600,
                    }}>
                        <Zap size={14} /> Plateforme éducative #1 au Bénin
                    </div>

                    <h1 style={{ marginBottom: 20, maxWidth: 780, margin: '0 auto 20px' }}>
                        Apprendre ensemble,<br />
                        <span style={{ color: 'var(--amber)', fontStyle: 'italic' }}>grandir ensemble</span>
                    </h1>

                    <p style={{ color: 'var(--text-secondary)', fontSize: 18, maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.8 }}>
                        Kplɔ́n nǔ connecte étudiants et professeurs avec des cours structurés, un assistant IA, des quiz adaptatifs et des visioconférences — tout en un.
                    </p>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
                        <Link to="/register" className="btn btn-primary btn-lg" style={{ gap: 10, padding: '14px 32px' }}>
                            Commencer gratuitement <ArrowRight size={17} />
                        </Link>
                        <Link to="/login" className="btn btn-secondary btn-lg" style={{ gap: 10, padding: '14px 32px' }}>
                            <Play size={17} /> Voir une démo
                        </Link>
                    </div>

                    {/* Hero visual */}
                    <div style={{
                        maxWidth: 780, margin: '0 auto',
                        background: 'var(--bg-surface)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 24,
                        boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
                        position: 'relative',
                    }}>
                        {/* Simulated dashboard preview */}
                        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, height: 320 }}>
                            {/* Sidebar preview */}
                            <div style={{ background: 'var(--bg-deep)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
                                {['Tableau de bord', 'Mes cours', 'Assistant Mɛsi', 'Flashcards', 'Quiz', 'Progression'].map((item, i) => (
                                    <div key={item} style={{
                                        padding: '9px 12px', borderRadius: 8, marginBottom: 4, fontSize: 13,
                                        background: i === 0 ? 'var(--amber-glow)' : 'transparent',
                                        color: i === 0 ? 'var(--amber)' : 'var(--text-muted)',
                                        transition: 'all 0.2s',
                                    }}>{item}</div>
                                ))}
                            </div>
                            {/* Content preview */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                    {[
                                        { label: '3 cours', color: 'var(--amber)' },
                                        { label: '76% quiz', color: 'var(--jade)' },
                                        { label: '🔥 7 jours', color: 'var(--coral)' },
                                    ].map(({ label, color }) => (
                                        <div key={label} style={{ background: 'var(--bg-raised)', borderRadius: 10, padding: 12, border: `1px solid rgba(255,255,255,0.05)`, fontSize: 13, color, fontWeight: 700, textAlign: 'center' }}>{label}</div>
                                    ))}
                                </div>
                                {[
                                    { title: 'Algorithmes et Structures de Données', progress: 65, color: '#F0A500' },
                                    { title: 'Bases de Données Avancées', progress: 30, color: '#00C9A7' },
                                    { title: 'React.js de A à Z', progress: 10, color: '#8B5CF6' },
                                ].map((course) => (
                                    <div key={course.title} style={{ background: 'var(--bg-raised)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <BookOpen size={16} color={course.color} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 6 }}>{course.title}</div>
                                            <div className="progress-bar" style={{ height: 4 }}>
                                                <div className="progress-fill" style={{ width: `${course.progress}%`, background: course.color }} />
                                            </div>
                                        </div>
                                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{course.progress}%</span>
                                    </div>
                                ))}
                                {/* Chat preview */}
                                <div style={{ background: 'var(--bg-deep)', borderRadius: 10, padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--jade))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Brain size={13} color="white" />
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                        <strong style={{ color: 'var(--amber)' }}>Mɛsi</strong> — Avant de vous expliquer, avez-vous essayé d'appliquer le principe LIFO dans ce problème ?
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---- STATS ---- */}
            <section style={{ padding: '64px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
                    {STATS.map(({ value, label, icon: Icon }) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                            <Icon size={24} color="var(--amber)" style={{ marginBottom: 12 }} />
                            <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>{value}</div>
                            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---- FEATURES ---- */}
            <section style={{ padding: '96px 32px' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <div className="badge badge-amber" style={{ marginBottom: 16 }}>Fonctionnalités</div>
                        <h2 style={{ marginBottom: 16 }}>Tout ce dont vous avez besoin<br />pour réussir</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
                            Une plateforme complète pensée pour le contexte béninois et les réalités de l'enseignement supérieur.
                        </p>
                    </div>
                    <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                        {FEATURES.map(({ icon: Icon, color, title, desc }) => (
                            <div key={title} className="card card-hover animate-fade-in" style={{ padding: 24 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                    <Icon size={22} color={color} />
                                </div>
                                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</div>
                                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---- TESTIMONIALS ---- */}
            <section style={{ padding: '80px 32px', background: 'var(--bg-deep)' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 52 }}>
                        <div className="badge badge-jade" style={{ marginBottom: 16 }}>Témoignages</div>
                        <h2>Ce que disent nos utilisateurs</h2>
                    </div>
                    <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {TESTIMONIALS.map(({ name, role, text, avatar, stars }) => (
                            <div key={name} className="card animate-fade-in" style={{ padding: 24, background: 'var(--bg-surface)' }}>
                                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                                    {Array.from({ length: stars }).map((_, i) => (
                                        <Star key={i} size={14} fill="var(--amber)" color="var(--amber)" />
                                    ))}
                                </div>
                                <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20, fontStyle: 'italic' }}>
                                    "{text}"
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{avatar}</div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---- HOW IT WORKS ---- */}
            <section style={{ padding: '96px 32px' }}>
                <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
                    <div className="badge badge-violet" style={{ marginBottom: 16 }}>Comment ça marche</div>
                    <h2 style={{ marginBottom: 48 }}>Démarrez en 3 étapes</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, textAlign: 'left' }}>
                        {[
                            { step: '01', title: 'Créez votre compte', desc: 'Inscrivez-vous en tant qu\'étudiant ou professeur en moins d\'une minute.', color: 'var(--amber)' },
                            { step: '02', title: 'Rejoignez une salle', desc: 'Rejoignez la salle de classe de votre professeur avec un code d\'invitation.', color: 'var(--jade)' },
                            { step: '03', title: 'Apprenez & progressez', desc: 'Accédez aux cours, posez des questions à Mɛsi et suivez votre progression.', color: 'var(--violet)' },
                        ].map(({ step, title, desc, color }) => (
                            <div key={step} style={{ padding: 24, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
                                <div style={{ fontSize: 48, fontWeight: 800, color, opacity: 0.18, fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: 12 }}>{step}</div>
                                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{title}</div>
                                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---- CTA ---- */}
            <section style={{ padding: '80px 32px', background: 'var(--bg-deep)' }}>
                <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ width: 56, height: 56, background: 'var(--amber)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <GraduationCap size={28} color="var(--bg-void)" />
                    </div>
                    <h2 style={{ marginBottom: 16 }}>Prêt à transformer votre<br />façon d'apprendre ?</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 36, lineHeight: 1.8 }}>
                        Rejoignez des milliers d'étudiants et de professeurs qui font confiance à Kplɔ́n nǔ pour leur réussite académique.
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Créer un compte gratuit <ArrowRight size={16} />
                        </Link>
                        <Link to="/login" className="btn btn-secondary btn-lg">
                            Se connecter
                        </Link>
                    </div>
                    <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 32 }}>
                        {['Gratuit pour commencer', 'Sans engagement', 'Accessible hors-ligne'].map(t => (
                            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                                <CheckCircle size={13} color="var(--jade)" /> {t}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---- FOOTER ---- */}
            <footer style={{ padding: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 26, height: 26, background: 'var(--amber)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <GraduationCap size={14} color="var(--bg-void)" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--text-secondary)' }}>Kplɔ́n nǔ</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    © 2026 Kplɔ́n nǔ · Fait avec ❤️ pour les étudiants béninois
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                    <Link to="/login" style={{ fontSize: 13, color: 'var(--text-muted)' }}>Connexion</Link>
                    <Link to="/register" style={{ fontSize: 13, color: 'var(--text-muted)' }}>Inscription</Link>
                </div>
            </footer>
        </div>
    );
}
