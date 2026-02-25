import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Loader, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'student', school: '', filiere: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Les mots de passe ne correspondent pas'); return; }
    if (form.password.length < 8) { toast.error('Mot de passe trop court (min 8 caractères)'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Compte créé ! Vous pouvez vous connecter.');
      navigate('/login');
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 'var(--radius-xl)',
        padding: '48px',
        width: '100%', maxWidth: 520,
        animation: 'fadeIn 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, background: 'var(--amber)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={18} color="var(--bg-void)" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Kplɔ́n nǔ</span>
        </div>

        <h2 style={{ marginBottom: 6 }}>Créer un compte</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Rejoignez des milliers d'étudiants béninois</p>

        {/* Role selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {['student', 'professor'].map(role => (
            <button
              key={role}
              type="button"
              onClick={() => setForm(f => ({ ...f, role }))}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${form.role === role ? 'var(--amber)' : 'rgba(255,255,255,0.08)'}`,
                background: form.role === role ? 'var(--amber-glow)' : 'var(--bg-raised)',
                color: form.role === role ? 'var(--amber)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 14, fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              {role === 'student' ? '👩‍🎓 Étudiant' : '👨‍🏫 Professeur'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Nom complet</label>
            <input className="input-field" name="name" placeholder="Prénom Nom" value={form.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input className="input-field" name="email" type="email" placeholder="vous@exemple.com" value={form.email} onChange={handleChange} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="input-group">
              <label className="input-label">Établissement</label>
              <input className="input-field" name="school" placeholder="Ex: UAC" value={form.school} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">Filière</label>
              <input className="input-field" name="filiere" placeholder="Ex: Informatique" value={form.filiere} onChange={handleChange} />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input className="input-field" name="password" type={showPw ? 'text' : 'password'} placeholder="Min. 8 caractères" value={form.password} onChange={handleChange} required style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Confirmer le mot de passe</label>
            <input className="input-field" name="confirm" type="password" placeholder="••••••••" value={form.confirm} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Création...</> : <>Créer mon compte <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Déjà inscrit ? <Link to="/login" style={{ color: 'var(--amber)' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
