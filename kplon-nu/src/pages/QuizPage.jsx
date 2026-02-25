import React, { useState } from 'react';
import { QUIZZES, COURSES } from '../data/mockData.js';
import { Target, CheckCircle2, XCircle, ChevronRight, Award, RotateCcw, Clock } from 'lucide-react';

export default function QuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timer] = useState(null);

  const quiz = QUIZZES[0];
  const questions = quiz?.questions || [];
  const question = questions[currentQ];

  const handleSelect = (idx) => {
    if (confirmed) return;
    setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    setShowExplanation(true);
    setAnswers(a => [...a, { questionId: question.id, selected, correct: selected === question.correct }]);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(i => i + 1);
      setSelected(null);
      setConfirmed(false);
      setShowExplanation(false);
    } else {
      setDone(true);
    }
  };

  const restart = () => {
    setCurrentQ(0); setSelected(null); setConfirmed(false);
    setAnswers([]); setDone(false); setShowExplanation(false);
  };

  if (done) {
    const score = answers.filter(a => a.correct).length;
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 440 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'}</div>
          <h2 style={{ marginBottom: 8 }}>Quiz terminé !</h2>
          <div style={{
            fontSize: 72, fontWeight: 700,
            color: pct >= 80 ? 'var(--jade)' : pct >= 60 ? 'var(--amber)' : 'var(--coral)',
            marginBottom: 8,
            fontFamily: 'var(--font-display)',
          }}>{pct}%</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
            {score}/{questions.length} bonnes réponses — {pct >= 80 ? 'Excellent travail !' : pct >= 60 ? 'Bien, continuez !' : 'À retravailler !'}
          </p>

          {/* Per-question review */}
          <div style={{ marginBottom: 28, textAlign: 'left' }}>
            {answers.map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 'var(--radius-md)',
                background: a.correct ? 'var(--jade-glow)' : 'var(--coral-glow)',
                border: `1px solid ${a.correct ? 'rgba(0,201,167,0.3)' : 'rgba(255,107,107,0.3)'}`,
                marginBottom: 8,
                fontSize: 13,
              }}>
                {a.correct ? <CheckCircle2 size={16} color="var(--jade)" /> : <XCircle size={16} color="var(--coral)" />}
                <span>Question {i + 1} : {a.correct ? 'Correcte ✓' : 'Incorrecte'}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={restart} className="btn btn-primary btn-full">
              <RotateCcw size={16} /> Recommencer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return <div className="page-container"><p>Aucun quiz disponible.</p></div>;

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Quiz adaptatif</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{quiz.title}</p>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          <span>Question {currentQ + 1} sur {questions.length}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Target size={13} />
            {answers.filter(a => a.correct).length} bonne{answers.filter(a => a.correct).length !== 1 ? 's' : ''} réponse{answers.filter(a => a.correct).length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="progress-bar" style={{ height: 6 }}>
          <div className="progress-fill" style={{ width: `${((currentQ) / questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div style={{ maxWidth: 680 }}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 12 }}>
            Question {currentQ + 1}
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5 }}>{question.question}</div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {question.options.map((opt, idx) => {
            let bg = 'var(--bg-surface)';
            let borderColor = 'rgba(255,255,255,0.08)';
            let color = 'var(--text-primary)';

            if (confirmed) {
              if (idx === question.correct) { bg = 'var(--jade-glow)'; borderColor = 'rgba(0,201,167,0.5)'; color = 'var(--jade)'; }
              else if (idx === selected && idx !== question.correct) { bg = 'var(--coral-glow)'; borderColor = 'rgba(255,107,107,0.5)'; color = 'var(--coral)'; }
            } else if (selected === idx) {
              bg = 'var(--amber-glow)'; borderColor = 'var(--amber)'; color = 'var(--amber)';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                style={{
                  width: '100%', textAlign: 'left',
                  background: bg, border: `2px solid ${borderColor}`,
                  borderRadius: 'var(--radius-md)', padding: '14px 18px',
                  color, fontSize: 15, cursor: confirmed ? 'default' : 'pointer',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 12,
                  fontFamily: 'var(--font-body)',
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: bg, border: `2px solid ${borderColor}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>
                  {confirmed && idx === question.correct ? <CheckCircle2 size={15} /> :
                   confirmed && idx === selected && idx !== question.correct ? <XCircle size={15} /> :
                   String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div style={{
            background: 'rgba(240,165,0,0.08)',
            border: '1px solid var(--amber-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: 20,
            fontSize: 14,
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ fontWeight: 700, color: 'var(--amber)', marginBottom: 6 }}>💡 Explication</div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{question.explanation}</div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          {!confirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selected === null}
              className="btn btn-primary btn-lg"
              style={{ opacity: selected === null ? 0.4 : 1 }}
            >
              Valider ma réponse
            </button>
          ) : (
            <button onClick={handleNext} className="btn btn-primary btn-lg">
              {currentQ < questions.length - 1 ? <><span>Question suivante</span> <ChevronRight size={16} /></> : <><Award size={16} /> Voir mes résultats</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
