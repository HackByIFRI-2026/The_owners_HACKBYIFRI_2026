import React, { useState, useRef, useEffect } from 'react';
import { COURSES, CHAT_HISTORY } from '../data/mockData.js';
import { Brain, Send, Loader, RefreshCw, BookOpen, Sparkles, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const MOCK_RESPONSES = [
  "Je vais vous expliquer cela de façon progressive. D'abord, une question pour vérifier votre compréhension : **quels sont selon vous les éléments essentiels d'un algorithme ?** Répondez librement, puis nous approfondirons ensemble.",
  "Excellente question ! Pour vous guider sans vous donner la réponse directement : imaginez que vous devez ranger des livres dans une bibliothèque. **Comment procéderiez-vous pour les retrouver facilement ?** C'est exactement l'idée derrière les structures de données.",
  "Voici une analogie concrète :\n\n> 🎯 **Analogie** : Une pile (stack) fonctionne comme une pile d'assiettes. Vous ne pouvez poser ou prendre une assiette **qu'en haut**. C'est le principe LIFO (Last In, First Out).\n\nMaintenant, pouvez-vous me donner un exemple de situation réelle où ce comportement est utile dans un programme ?",
  "Je vois que vous progressez bien ! Voici un **mini-exercice de validation** :\n\n```python\ndef est_palindrome(s):\n    # Complétez cette fonction\n    # En utilisant une pile\n    pass\n```\n\nEssayez d'implémenter cette fonction. Je suis là pour vous guider si vous bloquez.",
  "**Reformulation simplifiée** 💡\n\nLa complexité algorithmique, c'est simplement une façon de mesurer **combien de travail** un algorithme doit faire quand la taille des données augmente.\n\n- O(1) → Travail constant, quelle que soit la taille\n- O(n) → Travail proportionnel à la taille\n- O(n²) → Travail qui explose quand la taille augmente\n\nVous comprenez mieux maintenant ?",
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState(CHAT_HISTORY);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { id: Date.now(), role: 'user', content: input, time: new Date() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const resp = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      setMessages(m => [...m, { id: Date.now() + 1, role: 'assistant', content: resp, time: new Date() }]);
      setLoading(false);
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const sendExplainOtherwise = () => {
    setInput("Peux-tu m'expliquer autrement avec une analogie simple ?");
    inputRef.current?.focus();
  };

  const quickPrompts = [
    "Je n'ai pas compris ce chapitre",
    "Donne-moi un exercice pour pratiquer",
    "Quels sont les points essentiels à retenir ?",
    "Explique-moi étape par étape",
  ];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--topbar-height))', overflow: 'hidden' }}>
      {/* Left sidebar: course selector + history */}
      <div style={{
        width: 260,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        background: 'var(--bg-deep)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
            Cours actif
          </div>
          <select
            className="input-field"
            value={selectedCourse?.id}
            onChange={e => setSelectedCourse(COURSES.find(c => c.id === parseInt(e.target.value)))}
            style={{ marginBottom: 0 }}
          >
            {COURSES.filter(c => c.isEnrolled).map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {selectedCourse && (
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{
              background: `${selectedCourse.color}15`,
              border: `1px solid ${selectedCourse.color}30`,
              borderRadius: 'var(--radius-md)',
              padding: 12,
            }}>
              <BookOpen size={16} color={selectedCourse.color} style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: selectedCourse.color }}>{selectedCourse.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{selectedCourse.chaptersCount} chapitres</div>
            </div>
          </div>
        )}

        <div style={{ padding: '16px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
            Suggestions rapides
          </div>
          {quickPrompts.map(q => (
            <button
              key={q}
              onClick={() => { setInput(q); inputRef.current?.focus(); }}
              style={{
                width: '100%', textAlign: 'left',
                background: 'none', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 'var(--radius-md)',
                padding: '9px 12px',
                color: 'var(--text-secondary)',
                fontSize: 12, cursor: 'pointer',
                marginBottom: 6, transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--amber-border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Chat header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--violet), var(--jade))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Brain size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Mɛsi</div>
              <div style={{ fontSize: 12, color: 'var(--jade)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--jade)' }} />
                En ligne · IA pédagogique
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={sendExplainOtherwise}
              className="btn btn-secondary btn-sm"
            >
              <Sparkles size={14} /> Explique-moi autrement
            </button>
            <button
              onClick={() => setMessages(CHAT_HISTORY)}
              className="btn btn-ghost btn-sm"
            >
              <RefreshCw size={14} /> Nouvelle session
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex',
              gap: 12,
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              animation: 'fadeIn 0.3s ease',
            }}>
              {/* Avatar */}
              <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: msg.role === 'assistant' ? 'linear-gradient(135deg, var(--violet), var(--jade))' : 'var(--amber)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: 'white',
              }}>
                {msg.role === 'assistant' ? <Brain size={16} /> : 'M'}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: '70%',
                background: msg.role === 'assistant' ? 'var(--bg-surface)' : 'var(--amber)',
                color: msg.role === 'user' ? 'var(--bg-void)' : 'var(--text-primary)',
                borderRadius: msg.role === 'assistant' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                padding: '14px 18px',
                border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                fontSize: 14, lineHeight: 1.7,
              }}>
                {msg.role === 'assistant' ? (
                  <div style={{ fontFamily: 'var(--font-body)' }}>
                    <ReactMarkdown
                      components={{
                        p: ({children}) => <p style={{ marginBottom: 8 }}>{children}</p>,
                        strong: ({children}) => <strong style={{ color: 'var(--amber)', fontWeight: 700 }}>{children}</strong>,
                        code: ({children, inline}) => inline ? (
                          <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-raised)', padding: '2px 6px', borderRadius: 4, fontSize: 13 }}>{children}</code>
                        ) : (
                          <pre style={{ background: 'var(--bg-raised)', padding: '12px 16px', borderRadius: 8, overflow: 'auto', marginTop: 8, marginBottom: 8 }}>
                            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{children}</code>
                          </pre>
                        ),
                        blockquote: ({children}) => (
                          <div style={{ borderLeft: '3px solid var(--amber)', paddingLeft: 12, color: 'var(--text-secondary)', marginTop: 8, marginBottom: 8 }}>{children}</div>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : msg.content}
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6, textAlign: 'right' }}>
                  {msg.time?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: 'flex', gap: 12, animation: 'fadeIn 0.3s ease' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--jade))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={16} color="white" />
              </div>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px 16px 16px 16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 6 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1.2s ease infinite', animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              className="input-field"
              placeholder="Posez votre question à Mɛsi... (Entrée pour envoyer)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              style={{ flex: 1, resize: 'none', margin: 0, maxHeight: 120 }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="btn btn-primary"
              style={{ padding: '12px 16px', alignSelf: 'flex-end', opacity: !input.trim() || loading ? 0.5 : 1 }}
            >
              {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
            </button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
            Mɛsi vous guide sans donner les réponses directement · Contextualisé au cours "{selectedCourse?.title}"
          </div>
        </div>
      </div>
    </div>
  );
}
