import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import { Bell, Sun, Moon, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Avatar from '../components/Avatar';

function Topbar({ onMenuToggle }) {
    const { user } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();

    return (
        <div className="topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', gap: 12 }}>
            {/* Mobile hamburger */}
            <button
                onClick={onMenuToggle}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 6, display: 'none' }}
                className="mobile-only"
            >
                <Menu size={22} />
            </button>

            {/* Page title (empty — pages set their own) */}
            <div style={{ flex: 1 }} />

            {/* Right controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    style={{
                        background: 'var(--bg-raised)', border: '1px solid var(--border)',
                        borderRadius: 10, padding: '7px 10px', cursor: 'pointer',
                        color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
                        transition: 'all 0.2s',
                    }}
                    title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
                >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                {/* Notifications */}
                <NavLink to="/notifications" style={{ position: 'relative', background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 10, padding: '7px 10px', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', transition: 'all 0.2s' }}>
                    <Bell size={16} />
                    <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, background: 'var(--coral)', borderRadius: '50%' }} />
                </NavLink>

                {/* User info */}
                <NavLink to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, background: 'var(--bg-raised)', border: '1px solid var(--border)', textDecoration: 'none', transition: 'all 0.2s' }}>
                    <Avatar src={user?.avatar} firstName={user?.firstName} lastName={user?.lastName} size={28} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                        {user?.firstName || 'Utilisateur'}
                    </span>
                </NavLink>
            </div>
        </div>
    );
}

export default function DashboardLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { initTheme } = useThemeStore();

    useEffect(() => { initTheme(); }, []);

    return (
        <div className="app-layout">
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
            <div className="main-content">
                <Topbar onMenuToggle={() => setMobileOpen(!mobileOpen)} />
                <Outlet />
            </div>
        </div>
    );
}
