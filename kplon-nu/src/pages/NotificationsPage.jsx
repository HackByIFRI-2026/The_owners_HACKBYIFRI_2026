import React, { useState } from 'react';
import { NOTIFICATIONS } from '../data/mockData.js';
import { Bell, BookOpen, Target, TrendingDown, MessageSquare, Check } from 'lucide-react';

const TYPE_CONFIG = {
  course: { icon: BookOpen, color: 'var(--amber)', bg: 'var(--amber-glow)', label: 'Nouveau cours' },
  challenge: { icon: Target, color: 'var(--jade)', bg: 'var(--jade-glow)', label: 'Défi' },
  reminder: { icon: Bell, color: 'var(--violet)', bg: 'var(--violet-glow)', label: 'Rappel' },
  progress: { icon: TrendingDown, color: 'var(--coral)', bg: 'var(--coral-glow)', label: 'Progression' },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const markAllRead = () => setNotifs(n => n.map(nn => ({ ...nn, read: true })));
  const markRead = (id) => setNotifs(n => n.map(nn => nn.id === id ? { ...nn, read: true } : nn));

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Notifications</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {unread > 0 ? <><span style={{ color: 'var(--coral)', fontWeight: 700 }}>{unread}</span> non lue{unread > 1 ? 's' : ''}</> : 'Tout est lu !'}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn btn-secondary btn-sm">
            <Check size={14} /> Tout marquer comme lu
          </button>
        )}
      </div>

      <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifs.map(notif => {
          const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.reminder;
          const Icon = cfg.icon;
          return (
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              style={{
                background: notif.read ? 'var(--bg-surface)' : 'var(--bg-raised)',
                border: `1px solid ${notif.read ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '16px 18px',
                display: 'flex', gap: 14, alignItems: 'flex-start',
                cursor: 'pointer', transition: 'all 0.2s',
                animation: 'fadeIn 0.3s ease',
                position: 'relative',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = notif.read ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.1)'}
            >
              {!notif.read && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--coral)',
                }} />
              )}
              <div style={{
                width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                background: cfg.bg, border: `1px solid ${cfg.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={17} color={cfg.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cfg.label}</span>
                </div>
                <div style={{ fontSize: 14, color: notif.read ? 'var(--text-secondary)' : 'var(--text-primary)', lineHeight: 1.5, marginBottom: 4 }}>
                  {notif.message}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Il y a {notif.time}</div>
              </div>
            </div>
          );
        })}

        {notifs.every(n => n.read) && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <Bell size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <div style={{ fontSize: 15 }}>Toutes les notifications sont lues</div>
          </div>
        )}
      </div>
    </div>
  );
}
