import React, { useState } from 'react';
import { FLASHCARDS, COURSES } from '../data/mockData.js';
import { RotateCcw, Check, X, ChevronRight, ChevronLeft, Layers, Award, Zap } from 'lucide-react';

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState('study'); // study | review
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(1);

  const cards = FLASHCARDS.filter(f => f.courseId === selectedCourse);
  const current = cards[currentIndex];
  const masteredCount = cards.filter(c => c.mastered).length;

  const handleAnswer = (knew) => {
    setResults(r => [...r, { id: current.id, knew }]);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(i => i + 1);
      setFlipped(false);
    } else {
      setDone(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setResults([]);
    setDone(false);
  };

  if (done) {
    const known = results.filter(r => r.knew).length;
    return (
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{known === cards.length ? '🎉' : known >= cards.length / 2 ? '👍' : '📚'}</div>
          <h2 style={{ marginBottom: 8 }}>Session terminée !</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            Vous avez répondu correctement à <strong style={{ color: 'var(--jade)' }}>{known}/{cards.length}</strong> cartes
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
            <div style={{ background: 'var(--jade-glow)', border: '1px solid rgba(0,201,167,0.3)', borderRadius: 'var(--radius-md)', padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--jade)' }}>{known}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Maîtrisées</div>
            </div>
            <div style={{ background: 'var(--coral-glow)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 'var(--radius-md)', padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--coral)' }}>{cards.length - known}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>À revoir</div>
            </div>
          </div>

          <button onClick={restart} className="btn btn-primary btn-full">
            <RotateCcw size={16} /> Recommencer
          </button>
        </div>
      </div>
    );
  }

  if (!current) return <div className="page-container"><p>Aucune flashcard disponible pour ce cours.</p></div>;

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Flashcards</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Révision par répétition espacée</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <select className="input-field" value={selectedCourse} onChange={e => { setSelectedCourse(parseInt(e.target.value)); restart(); }} style={{ margin: 0, minWidth: 200 }}>
            {COURSES.filter(c => c.isEnrolled).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        {[
          { label: 'Total', value: cards.length, icon: Layers, color: 'amber' },
          { label: 'Maîtrisées', value: masteredCount, icon: Award, color: 'jade' },
          { label: 'À revoir', value: cards.length - masteredCount, icon: Zap, color: 'coral' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`stat-card ${color}`} style={{ flex: 1, minWidth: 120, padding: 14 }}>
            <Icon size={16} color={`var(--${color})`} style={{ marginBottom: 6 }} />
            <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          <span>Carte {currentIndex + 1} / {cards.length}</span>
          <span>{results.filter(r => r.knew).length} bonnes réponses</span>
        </div>
        <div className="progress-bar" style={{ height: 4 }}>
          <div className="progress-fill jade" style={{ width: `${(currentIndex / cards.length) * 100}%` }} />
        </div>
      </div>

      {/* Flashcard */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          onClick={() => setFlipped(f => !f)}
          style={{
            width: '100%', maxWidth: 600,
            minHeight: 280,
            background: flipped ? 'linear-gradient(135deg, rgba(0,201,167,0.12), rgba(0,201,167,0.04))' : 'var(--bg-surface)',
            border: `2px solid ${flipped ? 'rgba(0,201,167,0.4)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 'var(--radius-xl)',
            padding: '40px 48px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
            boxShadow: flipped ? '0 0 40px rgba(0,201,167,0.12)' : 'none',
            userSelect: 'none',
            marginBottom: 24,
          }}
        >
          <div style={{
            position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
            fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
            color: flipped ? 'var(--jade)' : 'var(--text-muted)',
          }}>
            {flipped ? '✓ Réponse' : '? Question'}
          </div>

          <div style={{
            fontSize: 18, fontWeight: flipped ? 400 : 600,
            lineHeight: 1.6, color: flipped ? 'var(--text-secondary)' : 'var(--text-primary)',
          }}>
            {flipped ? current.back : current.front}
          </div>

          {!flipped && (
            <div style={{ position: 'absolute', bottom: 14, fontSize: 12, color: 'var(--text-muted)' }}>
              Cliquez pour révéler la réponse
            </div>
          )}
        </div>

        {/* Answer buttons */}
        {flipped ? (
          <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 400 }}>
            <button
              onClick={() => handleAnswer(false)}
              className="btn btn-full"
              style={{ background: 'var(--coral-glow)', color: 'var(--coral)', border: '1px solid rgba(255,107,107,0.3)', padding: '14px' }}
            >
              <X size={18} /> Je ne savais pas
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="btn btn-full"
              style={{ background: 'var(--jade-glow)', color: 'var(--jade)', border: '1px solid rgba(0,201,167,0.3)', padding: '14px' }}
            >
              <Check size={18} /> Je savais !
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              disabled={currentIndex === 0}
              onClick={() => { setCurrentIndex(i => i - 1); setFlipped(false); }}
              className="btn btn-secondary"
              style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setFlipped(true)}
              className="btn btn-primary btn-lg"
            >
              Révéler la réponse
            </button>
            <button
              disabled={currentIndex === cards.length - 1}
              onClick={() => { setCurrentIndex(i => i + 1); setFlipped(false); }}
              className="btn btn-secondary"
              style={{ opacity: currentIndex === cards.length - 1 ? 0.3 : 1 }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
