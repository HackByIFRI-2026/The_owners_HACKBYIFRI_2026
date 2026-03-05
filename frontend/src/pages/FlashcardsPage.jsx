import { useState, useEffect } from 'react';
import { Layers, ChevronLeft, ChevronRight, RotateCcw, Loader2, CheckCircle, XCircle, Trophy, Dumbbell, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { botService, classroomService } from '../services/services';
import toast from 'react-hot-toast';

const DEFAULT_CARDS = [
    { front: "Qu'est-ce qu'une liste chaînée ?", back: "Structure de données linéaire où chaque élément pointe vers le suivant. Permet une insertion/suppression en O(1) si on a le pointeur." },
    { front: "Quelle est la complexité de QuickSort en moyenne ?", back: "O(n log n) en moyenne. Dans le pire cas (tableau déjà trié), O(n²). Utilise la stratégie diviser pour régner." },
    { front: "Qu'est-ce que le polymorphisme ?", back: "Capacité d'un objet à prendre plusieurs formes. En POO : un objet enfant peut être traité comme son parent, mais avec ses propres comportements (surcharge/redéfinition)." },
    { front: "Différence entre SQL et NoSQL ?", back: "SQL : données structurées, schéma fixe, ACID, relations. NoSQL : schéma flexible, horizontal scalable, adapté aux grandes volumes. Ex: MongoDB (document), Redis (clé-valeur)." },
    { front: "Qu'est-ce qu'une closure en JavaScript ?", back: "Fonction qui mémorise son environnement lexical même après la fin de l'exécution de la fonction qui l'a créée. Permet la persistance des variables." },
];

export default function FlashcardsPage() {
    const [cards, setCards] = useState(DEFAULT_CARDS);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [known, setKnown] = useState([]);
    const [unknown, setUnknown] = useState([]);
    const [phase, setPhase] = useState('study'); // study | result
    const [generating, setGenerating] = useState(false);
    const [classrooms, setClassrooms] = useState([]);
    const [topic, setTopic] = useState('');

    useEffect(() => {
        classroomService.getMyEnrollments()
            .then(({ data }) => setClassrooms(data.data || []))
            .catch(() => { });
    }, []);

    const current = cards[currentIndex];

    const handleGenerate = async () => {
        if (!topic.trim()) { toast.error('Entrez un sujet pour générer des flashcards'); return; }
        setGenerating(true);
        try {
            const { data } = await botService.generateFlashcards(topic, 8);
            const generated = data.data || data.flashcards || [];
            if (generated.length > 0) {
                setCards(generated.map(c => ({ front: c.question || c.front, back: c.answer || c.back })));
                setCurrentIndex(0); setFlipped(false); setKnown([]); setUnknown([]); setPhase('study');
                toast.success(`${generated.length} flashcards générées !`);
            } else throw new Error('empty');
        } catch {
            toast.error('Génération impossible pour l\'instant — utilisation des cartes par défaut');
        } finally {
            setGenerating(false);
        }
    };

    const handleKnown = () => {
        setKnown(prev => [...prev, currentIndex]);
        advance();
    };
    const handleUnknown = () => {
        setUnknown(prev => [...prev, currentIndex]);
        advance();
    };
    const advance = () => {
        setFlipped(false);
        setTimeout(() => {
            if (currentIndex + 1 >= cards.length) setPhase('result');
            else setCurrentIndex(i => i + 1);
        }, 200);
    };
    const restart = () => {
        setCurrentIndex(0); setFlipped(false); setKnown([]); setUnknown([]); setPhase('study');
    };

    const score = Math.round((known.length / cards.length) * 100);

    if (phase === 'result') {
        return (
            <div className="page-container" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', paddingTop: 48 }}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                        {score >= 80 ? <Trophy size={64} color="var(--jade)" /> : score >= 50 ? <Dumbbell size={64} color="var(--amber)" /> : <BookOpen size={64} color="var(--coral)" />}
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Session terminée !</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 32 }}>
                        Vous avez maîtrisé <strong style={{ color: 'var(--amber)' }}>{known.length}</strong> sur <strong>{cards.length}</strong> cartes
                    </p>
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 32, marginBottom: 24 }}>
                        <div style={{ fontSize: 52, fontWeight: 800, color: score >= 80 ? 'var(--jade)' : score >= 50 ? 'var(--amber)' : 'var(--coral)', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
                            {score}%
                        </div>
                        <div className="progress-bar" style={{ marginBottom: 16, height: 8 }}>
                            <div className="progress-fill" style={{ width: `${score}%`, background: score >= 80 ? 'var(--jade)' : score >= 50 ? 'var(--amber)' : 'var(--coral)' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--jade)' }}>{known.length}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Maîtrisées</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--coral)' }}>{unknown.length}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>À revoir</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <button onClick={restart} className="btn btn-primary btn-lg"><RotateCcw size={16} /> Recommencer</button>
                        {unknown.length > 0 && (
                            <button onClick={() => { setCards(cards.filter((_, i) => unknown.includes(i))); setCurrentIndex(0); setFlipped(false); setKnown([]); setUnknown([]); setPhase('study'); }} className="btn btn-secondary btn-lg">
                                Réviser les ratées
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="page-container" style={{ maxWidth: 640, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 20, marginBottom: 4 }}>
                        <Layers size={20} style={{ display: 'inline', marginRight: 8, color: 'var(--amber)', verticalAlign: 'middle' }} />
                        Flashcards
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Carte {currentIndex + 1} / {cards.length}</p>
                </div>
                <button onClick={restart} className="btn btn-ghost btn-sm"><RotateCcw size={14} /> Reset</button>
            </div>

            {/* Generator */}
            <div className="card" style={{ padding: 16, marginBottom: 24, display: 'flex', gap: 10 }}>
                <input value={topic} onChange={e => setTopic(e.target.value)} className="input-field" style={{ flex: 1, marginBottom: 0 }} placeholder="Ex: Arbres binaires de recherche..." onKeyDown={e => e.key === 'Enter' && handleGenerate()} />
                <button onClick={handleGenerate} disabled={generating} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
                    {generating ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Layers size={14} />}
                    {generating ? 'Génération...' : 'Générer avec Mɛsi'}
                </button>
            </div>

            {/* Progress */}
            <div className="progress-bar" style={{ marginBottom: 28 }}>
                <div className="progress-fill" style={{ width: `${((currentIndex) / cards.length) * 100}%` }} />
            </div>

            {/* Flashcard */}
            <div className="flashcard-scene" style={{ marginBottom: 28 }} onClick={() => setFlipped(!flipped)}>
                <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`}>
                    <div className="flashcard-face flashcard-front">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Question</div>
                            <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.6 }}>{current?.front}</p>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 20 }}>Cliquez pour révéler la réponse</p>
                        </div>
                    </div>
                    <div className="flashcard-face flashcard-back">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 11, color: 'var(--amber)', fontFamily: 'var(--font-mono)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Réponse</div>
                            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-primary)' }}>{current?.back}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            {flipped ? (
                <div style={{ display: 'flex', gap: 16 }}>
                    <button onClick={handleUnknown} className="btn btn-danger btn-full btn-lg" style={{ gap: 8 }}>
                        <XCircle size={18} /> Je ne savais pas
                    </button>
                    <button onClick={handleKnown} className="btn btn-jade btn-full btn-lg" style={{ gap: 8 }}>
                        <CheckCircle size={18} /> Je savais !
                    </button>
                </div>
            ) : (
                <button onClick={() => setFlipped(true)} className="btn btn-secondary btn-full btn-lg">
                    Révéler la réponse
                </button>
            )}
        </div>
    );
}
