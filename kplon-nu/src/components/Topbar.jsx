import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { Bell, Search, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

const PAGE_TITLES = {
  '/dashboard': 'Tableau de bord',
  '/courses': 'Mes cours',
  '/my-courses': 'Mes cours',
  '/create-course': 'Créer un cours',
  '/ai-assistant': 'Assistant Mɛsi',
  '/flashcards': 'Flashcards & Révision',
  '/quiz': 'Quiz adaptatifs',
  '/progress': 'Ma progression',
  '/students': 'Gestion des étudiants',
  '/stats': 'Statistiques',
  '/notifications': 'Notifications',
  '/profile': 'Mon profil',
  '/settings': 'Paramètres',
};

export default function Topbar() {
  const { user } = useAuth();
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Kplɔ́n nǔ';
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header style={{
      height: 'var(--topbar-height)',
      background: 'rgba(13,17,23,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Left: breadcrumb */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
          {title}
        </h2>
      </div>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Online indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--jade)' }}>
          <Wifi size={14} />
          <span style={{ display: 'none' }}>En ligne</span>
        </div>

        {/* Notifications */}
        <NavLink to="/notifications" style={{
          position: 'relative',
          width: 36, height: 36,
          background: 'var(--bg-raised)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.08)',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--amber-border)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
        >
          <Bell size={16} color="var(--text-secondary)" />
          <span style={{
            position: 'absolute', top: -2, right: -2,
            width: 16, height: 16,
            background: 'var(--coral)',
            borderRadius: '50%',
            fontSize: 9, fontWeight: 700, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--bg-deep)',
          }}>2</span>
        </NavLink>

        {/* Avatar */}
        <NavLink to="/profile">
          <div className="avatar" style={{ width: 36, height: 36, fontSize: 13, cursor: 'pointer' }}>
            {initials}
          </div>
        </NavLink>
      </div>
    </header>
  );
}
