import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard, BookOpen, Brain, BarChart2, Bell,
    Settings, LogOut, GraduationCap, Users, PlusCircle,
    Target, Layers, School, Video, ChevronRight, Zap
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import Avatar from './Avatar';
import toast from 'react-hot-toast';

const studentNav = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/classrooms', icon: School, label: 'Mes salles' },
    { to: '/videos', icon: Video, label: 'Bibliothèque' },
    { to: '/ai-assistant', icon: Brain, label: 'Assistant Mɛsi' },
    { to: '/flashcards', icon: Layers, label: 'Flashcards' },
    { to: '/quiz', icon: Target, label: 'Quiz' },
    { to: '/progress', icon: BarChart2, label: 'Progression' },
    { to: '/notifications', icon: Bell, label: 'Notifications', badge: 2 },
];

const professorNav = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/classrooms', icon: School, label: 'Mes salles' },
    { to: '/videos', icon: Video, label: 'Bibliothèque' },
    { to: '/students', icon: Users, label: 'Étudiants' },
    { to: '/notifications', icon: Bell, label: 'Notifications', badge: 1 },
];

export default function Sidebar({ mobileOpen, onClose }) {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const isProfessor = user?.role === 'PROFESSOR';
    const nav = isProfessor ? professorNav : studentNav;
    const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : '?';

    const handleLogout = () => {
        logout();
        toast.success('Déconnexion réussie');
        navigate('/login');
    };

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-[99] lg:hidden"
                />
            )}
            <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
                {/* Logo */}
                <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
                    <Link to="/dashboard" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <img src="/logo-1.png" alt="Logo Kplɔ́n nǔ" style={{ width: 42, height: 42, objectFit: 'contain' }} />
                        <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--text-primary)', lineHeight: 1.1 }}>Kplɔ́n nǔ</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                {isProfessor ? 'Espace Professeur' : 'Espace Étudiant'}
                            </div>
                        </div>
                    </Link>
                </div>

                {/* User Card */}
                <div style={{ padding: '14px 12px', borderBottom: '1px solid var(--border)' }}>
                    <NavLink to="/profile" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, transition: 'background 0.2s', textDecoration: 'none' }}
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                        <Avatar src={user?.avatar} firstName={user?.firstName} lastName={user?.lastName} size={34} />
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.firstName} {user?.lastName}
                            </div>
                            {!isProfessor && (
                                <div style={{ fontSize: 11, color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Zap size={10} /> <span>Filière : {user?.majors?.[0] || '—'}</span>
                                </div>
                            )}
                            {isProfessor && (
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.expertiseField || 'Professeur'}</div>
                            )}
                        </div>
                        <ChevronRight size={13} color="var(--text-muted)" />
                    </NavLink>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '10px 10px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', padding: '4px 8px 8px' }}>Navigation</div>
                    {nav.map(({ to, icon: Icon, label, badge }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={onClose}
                            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                        >
                            <Icon size={16} />
                            <span style={{ flex: 1 }}>{label}</span>
                            {badge && (
                                <span style={{ background: 'var(--coral)', color: 'white', borderRadius: 100, fontSize: 10, fontWeight: 700, padding: '1px 6px' }}>{badge}</span>
                            )}
                        </NavLink>
                    ))}
                    {isProfessor && (
                        <>
                            <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
                            <NavLink to="/create-video" onClick={onClose} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                                <PlusCircle size={16} /> <span>Publier une vidéo</span>
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* Bottom */}
                <div style={{ padding: '10px', borderTop: '1px solid var(--border)' }}>
                    <NavLink to="/settings" onClick={onClose} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} style={{ marginBottom: 2 }}>
                        <Settings size={16} /> <span>Paramètres</span>
                    </NavLink>
                    <button onClick={handleLogout} className="nav-link" style={{ width: '100%', color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <LogOut size={16} /> <span>Déconnexion</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
