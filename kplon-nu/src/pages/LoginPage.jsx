import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Eye, EyeOff, GraduationCap, ArrowRight, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Bienvenue, ${user.name.split(' ')[0]} !`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (type) => {
    if (type === 'student') {
      setEmail('fifame.legba@gmail.com');
      setPassword('password123');
    } else {
      setEmail('koffi.ahouant@univ-benin.bj');
      setPassword('password123');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-void)',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background effects */}
      <div style={{
        position: 'absolute', top: -200, left: -200,
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(240,165,0,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -100, right: -100,
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,201,167,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Left panel — Illustration */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 64 }}>
          <div style={{
            width: 44, height: 44,
            background: 'var(--amber)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GraduationCap size={24} color="var(--bg-void)" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-primary)' }}>Kplɔ́n nǔ</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Apprends. Avance. Réussis.</div>
          </div>
        </div>

        <div className="animate-fade-in">
          <h1 style={{ marginBottom: 16, fontSize: 'clamp(2rem, 3vw, 2.8rem)', lineHeight: 1.15 }}>
            L'apprentissage<br />
            <span style={{ color: 'var(--amber)', fontStyle: 'italic' }}>sans frontières</span><br />
            pour les étudiants béninois
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 420, lineHeight: 1.7, marginBottom: 48 }}>
            Cours de vos professeurs, assistant IA Mɛsi, quiz adaptatifs et révision par répétition espacée — tout en un.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { emoji: '🎓', label: 'Cours de vos profs, format vidéo & PDF' },
            { emoji: '🤖', label: 'Mɛsi, votre assistant IA pédagogique' },
            { emoji: '🔥', label: 'Révision par répétition espacée' },
            { emoji: '📶', label: 'Mode hors-ligne pour zones à faible débit' },
          ].map(({ emoji, label }) => (
            <div key={label} className="animate-fade-in" style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <span style={{ fontSize: 20 }}>{emoji}</span>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — Login form */}
      <div style={{
        width: '44%',
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
      }}>
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 style={{ marginBottom: 8, fontSize: 28 }}>Connexion</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>
            Accédez à votre espace d'apprentissage
          </p>

          {/* Quick login shortcuts */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
            <button
              type="button"
              onClick={() => quickLogin('student')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: 12 }}
            >
              👩‍🎓 Démo Étudiant
            </button>
            <button
              type="button"
              onClick={() => quickLogin('professor')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: 12 }}
            >
              👨‍🏫 Démo Professeur
            </button>
          </div>

          <div className="divider" style={{ margin: '0 0 24px', position: 'relative' }}>
            <span style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'var(--bg-void)',
              padding: '0 12px',
              fontSize: 12,
              color: 'var(--text-muted)',
            }}>ou connectez-vous manuellement</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="vous@exemple.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24, marginTop: -8 }}>
              <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--amber)', textDecoration: 'none' }}>
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ gap: 10 }}
            >
              {loading ? (
                <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Connexion...</>
              ) : (
                <>Se connecter <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: 'var(--amber)' }}>S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
