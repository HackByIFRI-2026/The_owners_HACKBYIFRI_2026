import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  LayoutDashboard, BookOpen, Brain, BarChart2, Bell,
  Settings, LogOut, ChevronRight, Zap,
  GraduationCap, Users, PlusCircle, Target, Layers, School, Menu, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const studentNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/classrooms', icon: School, label: 'Mes salles' },
  { to: '/courses', icon: BookOpen, label: 'Cours' },
  { to: '/ai-assistant', icon: Brain, label: 'Assistant Mɛsi' },
  { to: '/flashcards', icon: Layers, label: 'Flashcards' },
  { to: '/quiz', icon: Target, label: 'Quiz' },
  { to: '/progress', icon: BarChart2, label: 'Progression' },
  { to: '/notifications', icon: Bell, label: 'Notifications', badge: 2 },
];

const professorNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/classrooms', icon: School, label: 'Mes salles' },
  { to: '/my-courses', icon: BookOpen, label: 'Mes cours' },
  { to: '/create-course', icon: PlusCircle, label: 'Publier un cours' },
  { to: '/students', icon: Users, label: 'Étudiants' },
  { to: '/stats', icon: BarChart2, label: 'Statistiques' },
  { to: '/notifications', icon: Bell, label: 'Notifications', badge: 1 },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = user?.role === 'professor' ? professorNav : studentNav;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  const sidebarContent = (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--bg-deep)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      height: '100vh',
      position: 'fixed',
      top: 0, left: mobileOpen ? 0 : undefined,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36,
            background: 'var(--amber)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <GraduationCap size={20} color="var(--bg-void)" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              Kplɔ́n nǔ
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              {user?.role === 'professor' ? 'Espace Professeur' : 'Espace Étudiant'}
            </div>
          </div>
        </div>
      </div>

      {/* User Card */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <NavLink to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-md)', transition: 'background 0.2s', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-raised)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{initials}</div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              {user?.role === 'student' && (
                <>
                  <Zap size={10} color="var(--amber)" />
                  <span style={{ color: 'var(--amber)' }}>{user?.points} pts</span>
                </>
              )}
              {user?.role === 'professor' && <span>Professeur</span>}
            </div>
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </NavLink>

        {/* Streak badge for students */}
        {user?.role === 'student' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--amber-glow)', borderRadius: 'var(--radius-sm)', marginTop: 8 }}>
            <span style={{ fontSize: 16 }}>🔥</span>
            <span style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600 }}>{user?.streak} jours de suite</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 12px' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '4px 8px 8px' }}>
          Navigation
        </div>
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              marginBottom: 2,
              transition: 'all 0.2s ease',
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--amber)' : 'var(--text-secondary)',
              background: isActive ? 'var(--amber-glow)' : 'transparent',
              textDecoration: 'none',
              position: 'relative',
            })}
          >
            <Icon size={17} />
            <span style={{ flex: 1 }}>{label}</span>
            {badge && (
              <span style={{
                background: 'var(--coral)',
                color: 'white',
                borderRadius: '100px',
                fontSize: 10,
                fontWeight: 700,
                padding: '1px 6px',
                minWidth: 18,
                textAlign: 'center',
              }}>{badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <NavLink
          to="/settings"
          onClick={() => setMobileOpen(false)}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
            borderRadius: 'var(--radius-md)', marginBottom: 2,
            color: isActive ? 'var(--amber)' : 'var(--text-secondary)',
            background: isActive ? 'var(--amber-glow)' : 'transparent',
            fontSize: 14, textDecoration: 'none', transition: 'all 0.2s',
          })}
        >
          <Settings size={17} />
          <span>Paramètres</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="btn btn-ghost btn-full"
          style={{ justifyContent: 'flex-start', gap: 10, padding: '9px 12px', fontSize: 14, color: 'var(--coral)' }}
        >
          <LogOut size={17} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99, display: 'none' }}
          className="mobile-overlay"
        />
      )}

      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="mobile-menu-btn"
        style={{
          display: 'none',
          position: 'fixed', top: 14, left: 14, zIndex: 110,
          background: 'var(--bg-surface)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8,
          padding: 8,
          cursor: 'pointer',
          color: 'var(--text-primary)',
        }}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {sidebarContent}
    </>
  );
}
