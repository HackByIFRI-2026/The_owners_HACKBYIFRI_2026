import { useState, useEffect } from 'react';
import { Target, Trophy, ChevronRight, RotateCcw, CheckCircle, XCircle, Dumbbell, BookOpen, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { quizService } from '../services/services';
import toast from 'react-hot-toast';

export default function QuizPage() {
    const [phase, setPhase] = useState('intro'); // intro | quiz | result
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [results, setResults] = useState([]);
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadQuiz = async () => {
        setLoading(true);
        try {
            const { data } = await quizService.getRandomQuiz();
            setQuizData(data.data);
            setPhase('quiz');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Aucun quiz disponible.');
        } finally {
            setLoading(false);
        }
    };

    const q = quizData?.questions?.[current];

    const handleSelect = (idx) => {
        if (answered) return;
        setSelected(idx);
        setAnswered(true);
        if (idx === q.answer) setScore(s => s + 1);
        setResults(prev => [...prev, { question: q.q, selected: idx, answer: q.answer, correct: idx === q.answer }]);
    };

    const next = () => {
        if (current + 1 >= quizData?.questions?.length) { setPhase('result'); return; }
        setCurrent(i => i + 1);
        setSelected(null);
        setAnswered(false);
    };

    const restart = () => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setResults([]); setPhase('intro'); };

    const pct = quizData?.questions?.length ? Math.round((score / quizData.questions.length) * 100) : 0;

    if (phase === 'intro') return (
        <div className="page-container" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', paddingTop: 48 }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><Brain size={64} color="var(--amber)" /></div>
                <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>Quiz Rapide</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 8 }}>Testez vos connaissances · Informatique & Algorithmique</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>Des explications détaillées après chaque réponse.</p>
                <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginBottom: 32 }}>
                    {[['Difficulté', 'Aléatoire'], ['Durée', 'Libre'], ['Score', '—']].map(([label, value]) => (
                        <div key={label}>
                            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--amber)', fontFamily: 'var(--font-display)' }}>{value}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
                        </div>
                    ))}
                </div>
                <button onClick={loadQuiz} disabled={loading} className="btn btn-primary btn-lg">
                    {loading ? 'Recherche d\'un quiz...' : 'Commencer le quiz '} {!loading && <ChevronRight size={16} />}
                </button>
            </motion.div>
        </div>
    );

    if (phase === 'result') return (
        <div className="page-container" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', paddingTop: 40 }}>
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>{pct >= 80 ? <Trophy size={64} color="var(--jade)" /> : pct >= 50 ? <Dumbbell size={64} color="var(--amber)" /> : <BookOpen size={64} color="var(--coral)" />}</div>
                <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Quiz terminé !</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>{score}/{quizData?.questions?.length} bonnes réponses</p>
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 28, marginBottom: 24 }}>
                    <div style={{ fontSize: 56, fontWeight: 800, color: pct >= 80 ? 'var(--jade)' : pct >= 50 ? 'var(--amber)' : 'var(--coral)', fontFamily: 'var(--font-display)', marginBottom: 12 }}>{pct}%</div>
                    <div className="progress-bar" style={{ height: 8 }}>
                        <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 80 ? 'var(--jade)' : pct >= 50 ? 'var(--amber)' : 'var(--coral)' }} />
                    </div>
                </div>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                    {results.map((r, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, padding: '12px', background: r.correct ? 'var(--jade-glow)' : 'rgba(255,107,107,0.08)', borderRadius: 10, border: `1px solid ${r.correct ? 'rgba(0,201,167,0.25)' : 'rgba(255,107,107,0.2)'}` }}>
                            {r.correct ? <CheckCircle size={16} color="var(--jade)" style={{ flexShrink: 0, marginTop: 2 }} /> : <XCircle size={16} color="var(--coral)" style={{ flexShrink: 0, marginTop: 2 }} />}
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.question}</div>
                        </div>
                    ))}
                </div>
                <button onClick={restart} className="btn btn-primary btn-lg"><RotateCcw size={16} /> Recommencer</button>
            </motion.div>
        </div>
    );

    return (
        <div className="page-container" style={{ maxWidth: 640, margin: '0 auto' }}>
            {quizData && (
                <>
                    <h3 style={{ textAlign: 'center', marginBottom: 20, fontFamily: 'var(--font-display)' }}>{quizData.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Question {current + 1} / {quizData.questions.length}</span>
                        <span style={{ fontSize: 14, color: 'var(--amber)', fontWeight: 700 }}>Score : {score}</span>
                    </div>
                    <div className="progress-bar" style={{ marginBottom: 28 }}>
                        <div className="progress-fill" style={{ width: `${(current / quizData.questions.length) * 100}%` }} />
                    </div>
                </>
            )}

            {quizData && q && (
                <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                    <div className="card" style={{ padding: 28, marginBottom: 20 }}>
                        <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.6 }}>{q.q}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                        {q.opts.map((opt, i) => {
                            let bg = 'var(--bg-surface)';
                            let border = 'var(--border)';
                            let color = 'var(--text-primary)';
                            if (answered) {
                                if (i === q.answer) { bg = 'var(--jade-glow)'; border = 'rgba(0,201,167,0.4)'; color = 'var(--jade)'; }
                                else if (i === selected && i !== q.answer) { bg = 'rgba(255,107,107,0.1)'; border = 'rgba(255,107,107,0.4)'; color = 'var(--coral)'; }
                            } else if (selected === i) { bg = 'var(--amber-glow)'; border = 'var(--amber-border)'; color = 'var(--amber)'; }
                            return (
                                <button key={i} onClick={() => handleSelect(i)} style={{ padding: '14px 18px', borderRadius: 12, border: `1.5px solid ${border}`, background: bg, color, fontSize: 14, textAlign: 'left', cursor: answered ? 'default' : 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    {opt}
                                </button>
                            );
                        })}
                    </div>

                    {answered && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <div style={{ background: selected === q.answer ? 'var(--jade-glow)' : 'rgba(255,107,107,0.1)', border: `1px solid ${selected === q.answer ? 'rgba(0,201,167,0.3)' : 'rgba(255,107,107,0.3)'}`, borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                <strong style={{ color: selected === q.answer ? 'var(--jade)' : 'var(--coral)' }}>{selected === q.answer ? 'Correct !' : 'Incorrect'}</strong>
                                {' '}{q.explication}
                            </div>
                            <button onClick={next} className="btn btn-primary btn-full btn-lg">
                                {current + 1 < quizData?.questions?.length ? 'Question suivante' : 'Voir les résultats'} <ChevronRight size={16} />
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
