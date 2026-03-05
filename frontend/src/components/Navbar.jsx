import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import useAuthStore from '../store/authStore';
import Avatar from './Avatar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';
const BASE_URL = API_URL.replace('/api/v1', '');

const Navbar = () => {
    const { user } = useAuthStore();
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-void/90 backdrop-blur-md">
            <div className="container mx-auto px-6 h-[var(--topbar-height)] flex items-center justify-between">

                {/* Brand */}
                <Link to="/" className="flex items-center gap-3 group">
                    <img src="/logo-1.png" alt="Logo Kplɔ́n nǔ" className="w-10 h-10 object-contain transition-transform group-hover:scale-105 duration-300" />
                    <span className="font-display font-medium text-2xl tracking-wide text-primary">
                        Kplɔ́n nǔ
                    </span>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-8 font-mono text-sm tracking-wide text-secondary">
                    <Link to="/" className="hover:text-amber transition-colors">Accueil</Link>
                    <Link to="/videos" className="hover:text-jade transition-colors">Bibliothèque</Link>
                    <a href="/#ecosystem" className="hover:text-amber transition-colors">Le Manifeste</a>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <Link to="/dashboard" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-colors rounded-full pr-4 pl-1 py-1 border border-white/10">
                            <Avatar src={user.avatar} firstName={user.firstName} lastName={user.lastName} size={32} />
                            <span className="font-mono text-sm tracking-wide text-primary">{user.firstName}</span>
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="hidden sm:flex items-center gap-2 text-secondary hover:text-primary transition-colors font-mono text-sm px-2 py-1">
                                <LogIn size={16} />
                                <span>Portail</span>
                            </Link>
                            <Link to="/register" className="btn btn-primary font-mono text-sm">
                                Initier le cursus
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
