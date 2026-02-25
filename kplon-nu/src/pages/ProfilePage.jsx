import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Camera, Save, Loader, User, Mail, School, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', school: user?.school || '', filiere: user?.filiere || '' });
  const [loading, setLoading] = useState(false);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      updateProfile(form);
      toast.success('Profil mis à jour !');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: 640 }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22, marginBottom: 28 }}>Mon profil</h2>

        {/* Avatar section */}
        <div className="card" style={{ padding: 28, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ position: 'relative' }}>
            <div className="avatar" style={{ width: 80, height: 80, fontSize: 28 }}>{initials}</div>
            <button style={{
              position: 'absolute', bottom: -4, right: -4,
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--amber)', border: '2px solid var(--bg-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Camera size={13} color="var(--bg-void)" />
            </button>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{user?.name}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className={`badge ${user?.role === 'student' ? 'badge-amber' : 'badge-jade'}`}>
                {user?.role === 'student' ? '👩‍🎓 Étudiant' : '👨‍🏫 Professeur'}
              </span>
              {user?.role === 'student' && (
                <span className="badge badge-amber">🔥 {user?.streak} jours de streak</span>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Informations personnelles</h3>
          <form onSubmit={handleSave}>
            <div className="input-group">
              <label className="input-label">Nom complet</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input-field" name="name" value={form.name} onChange={handleChange} style={{ paddingLeft: 42 }} />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input-field" value={user?.email} disabled style={{ paddingLeft: 42, opacity: 0.6 }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="input-group">
                <label className="input-label">Établissement</label>
                <div style={{ position: 'relative' }}>
                  <School size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="input-field" name="school" value={form.school} onChange={handleChange} style={{ paddingLeft: 42 }} placeholder="Ex: UAC" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Filière</label>
                <div style={{ position: 'relative' }}>
                  <Layers size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="input-field" name="filiere" value={form.filiere} onChange={handleChange} style={{ paddingLeft: 42 }} placeholder="Ex: Informatique" />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Sauvegarde...</> : <><Save size={15} /> Sauvegarder</>}
            </button>
          </form>
        </div>

        {/* Stats for students */}
        {user?.role === 'student' && (
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Mes statistiques</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { label: 'Points', value: user?.points?.toLocaleString() || '0', color: 'var(--amber)' },
                { label: 'Série', value: `${user?.streak || 0}j`, color: 'var(--coral)' },
                { label: 'Niveau', value: 'Inter.', color: 'var(--jade)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center', padding: 16, background: 'var(--bg-raised)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
