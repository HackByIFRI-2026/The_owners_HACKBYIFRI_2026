import { Link } from 'react-router-dom';
import { BookOpen, LogIn } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-void/90 backdrop-blur-md">
            <div className="container mx-auto px-6 h-[var(--topbar-height)] flex items-center justify-between">

                {/* Brand */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="text-amber transition-transform group-hover:scale-105 duration-300">
                        <BookOpen size={24} strokeWidth={2.5} />
                    </div>
                    <span className="font-display font-medium text-2xl tracking-wide text-primary">
                        Kplɔ́n nǔ
                    </span>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-8 font-mono text-sm tracking-wide text-secondary">
                    <Link to="/" className="hover:text-amber transition-colors">Accueil</Link>
                    <Link to="/courses" className="hover:text-jade transition-colors">Bibliothèque</Link>
                    <Link to="/about" className="hover:text-amber transition-colors">Le Manifeste</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link to="/login" className="hidden sm:flex items-center gap-2 text-secondary hover:text-primary transition-colors font-mono text-sm px-2 py-1">
                        <LogIn size={16} />
                        <span>Portail</span>
                    </Link>
                    <Link to="/register" className="btn btn-primary font-mono text-sm">
                        Initier le cursus
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
