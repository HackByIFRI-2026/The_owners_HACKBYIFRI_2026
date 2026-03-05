import { useState, useEffect, useRef } from 'react';
import { Brain, Send, Loader2, Layers, X, MessageSquare, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { botService, classroomService } from '../services/services';
import toast from 'react-hot-toast';

const QUICK_PROMPTS = [
    "Explique-moi les listes chaînées simplement",
    "Quelles sont les différences entre SQL et NoSQL ?",
    "Comment fonctionne la récursivité ?",
    "Donne-moi un exemple concret de polymorphisme",
];

export default function AIAssistantPage() {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `Bonjour ${user?.firstName || ''} ! Je suis **Mɛsi**, votre assistant pédagogique. Je suis là pour vous guider dans votre apprentissage — mais je ne donnerai jamais directement les réponses ! Posez-moi une question sur un concept que vous étudiez.`,
            time: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [quotaUsed, setQuotaUsed] = useState(0);
    const QUOTA_MAX = 20;
    const bottomRef = useRef(null);

    useEffect(() => {
        classroomService.getMyEnrollments()
            .then(({ data }) => setClassrooms(data.data || []))
            .catch(() => { });
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text = input.trim()) => {
        if (!text || loading) return;
        if (quotaUsed >= QUOTA_MAX) { toast.error(`Quota atteint (${QUOTA_MAX} questions/jour)`); return; }

        const userMsg = { role: 'user', content: text, time: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await botService.askQuestion(text, selectedClassroom);
            const answer = data.data?.response || data.response || "Je n'ai pas pu générer une réponse. Reformulez votre question.";
            setMessages(prev => [...prev, { role: 'assistant', content: answer, time: new Date() }]);
            setQuotaUsed(q => q + 1);
        } catch {
            // Fallback réponse pédagogique
            const fallbacks = [
                "Avant de répondre, avez-vous essayé de décomposer le problème étape par étape ? Quelle est la première chose que vous savez avec certitude ?",
                "Intéressante question ! Pour mieux vous guider : que comprenez-vous déjà sur ce sujet ? Quel point précis vous bloque ?",
                "Au lieu de vous donner la réponse directement, pensez à ce que vous avez déjà appris en cours. Quel concept s'applique ici ?",
            ];
            const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            setMessages(prev => [...prev, { role: 'assistant', content: `*(Mode hors-ligne)* ${fallback}`, time: new Date() }]);
            setQuotaUsed(q => q + 1);
        } finally {
            setLoading(false);
        }
    };

    const generateFlashcards = async () => {
        if (!selectedClassroom) { toast.error('Sélectionnez une salle de classe d\'abord'); return; }
        const lastContent = messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content || '';
        try {
            const { data } = await botService.generateFlashcards(lastContent, 5);
            toast.success(`${data.data?.length || 5} flashcards générées !`);
        } catch {
            toast.error('Impossible de générer les flashcards pour l\'instant');
        }
    };

    return (
        <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-height) - 56px)', padding: '20px 28px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--violet), var(--jade))', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Brain size={20} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18, marginBottom: 2 }}>Assistant Mɛsi</h2>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Quota : {quotaUsed}/{QUOTA_MAX} questions aujourd'hui</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <select
                        value={selectedClassroom}
                        onChange={e => setSelectedClassroom(e.target.value)}
                        className="input-field"
                        style={{ width: 'auto', fontSize: 13, padding: '8px 14px', minWidth: 180 }}
                    >
                        <option value="">Contexte : aucun</option>
                        {classrooms.map(cls => (
                            <option key={cls._id} value={cls._id}>{cls.name}</option>
                        ))}
                    </select>
                    <button onClick={generateFlashcards} className="btn btn-secondary btn-sm" style={{ gap: 6 }}>
                        <Layers size={14} /> Générer flashcards
                    </button>
                </div>
            </div>

            {/* Quota bar */}
            <div className="progress-bar" style={{ marginBottom: 16, height: 3 }}>
                <div className="progress-fill" style={{ width: `${(quotaUsed / QUOTA_MAX) * 100}%`, background: quotaUsed > QUOTA_MAX * 0.8 ? 'var(--coral)' : 'var(--jade)' }} />
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 4 }}>
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                            style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: msg.role === 'assistant' ? 'linear-gradient(135deg, var(--violet), var(--jade))' : 'var(--amber)',
                                fontSize: 12, fontWeight: 700, color: 'white',
                            }}>
                                {msg.role === 'assistant' ? <Brain size={14} /> : (user?.firstName?.[0] || 'E')}
                            </div>
                            <div style={{ maxWidth: '72%' }}>
                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                    background: msg.role === 'user' ? 'var(--amber)' : 'var(--bg-surface)',
                                    border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                    fontSize: 14, lineHeight: 1.7,
                                    whiteSpace: 'pre-wrap',
                                }}>
                                    {msg.content}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                                    {msg.time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {loading && (
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--jade))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Brain size={14} color="white" />
                        </div>
                        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '20px 20px 20px 4px', padding: '12px 16px', display: 'flex', gap: 5 }}>
                            {[0, 1, 2].map(i => (
                                <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text-muted)', animation: `pulse 1.4s ease ${i * 0.2}s infinite` }} />
                            ))}
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            {messages.length < 3 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '12px 0' }}>
                    {QUICK_PROMPTS.map(p => (
                        <button key={p} onClick={() => sendMessage(p)} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 100, padding: '6px 14px', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}>
                            {p}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div style={{ display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Posez votre question à Mɛsi..."
                    className="input-field"
                    style={{ flex: 1, marginBottom: 0 }}
                    disabled={loading}
                />
                <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="btn btn-primary" style={{ padding: '12px 16px', flexShrink: 0 }}>
                    {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />}
                </button>
            </div>
        </div>
    );
}
