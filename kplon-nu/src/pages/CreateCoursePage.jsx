import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, Trash2, Save, Loader, Video, FileText, Code, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const CHAPTER_TYPES = [
  { value: 'video', label: 'Vidéo', icon: Video },
  { value: 'pdf', label: 'Document PDF', icon: FileText },
  { value: 'tp', label: 'Travail Pratique', icon: Code },
];

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', description: '', level: 'Licence 1', tags: '' });
  const [chapters, setChapters] = useState([{ id: 1, title: '', type: 'video', duration: '', hints: '' }]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const addChapter = () => setChapters(c => [...c, { id: Date.now(), title: '', type: 'video', duration: '', hints: '' }]);
  const removeChapter = (id) => setChapters(c => c.filter(ch => ch.id !== id));
  const updateChapter = (id, field, value) => setChapters(c => c.map(ch => ch.id === id ? { ...ch, [field]: value } : ch));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error('Remplissez les champs obligatoires'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Cours publié avec succès !');
      navigate('/my-courses');
    }, 1500);
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: 720 }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Créer un nouveau cours</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Publiez vos contenus pédagogiques pour vos étudiants</p>

        <form onSubmit={handleSubmit}>
          {/* Course info */}
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>📚 Informations générales</h3>
            
            <div className="input-group">
              <label className="input-label">Titre du cours *</label>
              <input className="input-field" name="title" placeholder="Ex: Algorithmes et Structures de Données" value={form.title} onChange={handleChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="input-group">
                <label className="input-label">Matière *</label>
                <input className="input-field" name="subject" placeholder="Ex: Informatique" value={form.subject} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label className="input-label">Niveau</label>
                <select className="input-field" name="level" value={form.level} onChange={handleChange}>
                  {['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Description *</label>
              <textarea className="input-field" name="description" placeholder="Décrivez le contenu et les objectifs du cours..." value={form.description} onChange={handleChange} rows={4} />
            </div>

            <div className="input-group">
              <label className="input-label">Tags (séparés par des virgules)</label>
              <input className="input-field" name="tags" placeholder="Ex: Python, Algorithmes, Tri" value={form.tags} onChange={handleChange} />
            </div>
          </div>

          {/* Chapters */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16 }}>🎬 Chapitres & Contenu</h3>
              <button type="button" onClick={addChapter} className="btn btn-secondary btn-sm">
                <Plus size={14} /> Ajouter un chapitre
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {chapters.map((ch, i) => (
                <div key={ch.id} style={{
                  background: 'var(--bg-raised)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--amber-glow)', border: '1px solid var(--amber-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: 'var(--amber)', flexShrink: 0,
                    }}>{i + 1}</div>
                    <span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>Chapitre {i + 1}</span>
                    {chapters.length > 1 && (
                      <button type="button" onClick={() => removeChapter(ch.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--coral)', padding: 4 }}>
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, marginBottom: 10 }}>
                    <input
                      className="input-field"
                      placeholder="Titre du chapitre"
                      value={ch.title}
                      onChange={e => updateChapter(ch.id, 'title', e.target.value)}
                      style={{ margin: 0 }}
                    />
                    <select
                      className="input-field"
                      value={ch.type}
                      onChange={e => updateChapter(ch.id, 'type', e.target.value)}
                      style={{ margin: 0, minWidth: 140 }}
                    >
                      {CHAPTER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <input
                      className="input-field"
                      placeholder="Durée (ex: 45min)"
                      value={ch.duration}
                      onChange={e => updateChapter(ch.id, 'duration', e.target.value)}
                      style={{ margin: 0, width: 130 }}
                    />
                  </div>

                  {/* Upload zone */}
                  <div style={{
                    border: '2px dashed rgba(255,255,255,0.1)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                    marginBottom: 10,
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--amber-border)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  >
                    <Upload size={20} color="var(--text-muted)" style={{ marginBottom: 6 }} />
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      Glissez votre fichier ici ou <span style={{ color: 'var(--amber)' }}>parcourir</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      {ch.type === 'video' ? 'MP4, WebM — Max 2GB' : 'PDF — Max 50MB'}
                    </div>
                  </div>

                  {ch.type === 'tp' && (
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label" style={{ fontSize: 11 }}>Indices progressifs (un par ligne)</label>
                      <textarea
                        className="input-field"
                        placeholder="Indice 1: Commencez par...&#10;Indice 2: Pensez à..."
                        value={ch.hints}
                        onChange={e => updateChapter(ch.id, 'hints', e.target.value)}
                        rows={3}
                        style={{ fontSize: 13 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Publication...</> : <><Save size={16} /> Publier le cours</>}
            </button>
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/my-courses')}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
