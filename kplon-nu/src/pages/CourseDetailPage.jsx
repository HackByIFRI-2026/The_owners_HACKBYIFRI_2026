import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COURSES } from '../data/mockData.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Play, FileText, Code, CheckCircle2, Lock, ChevronRight, Brain, Download, BookOpen, Clock, Users, Star } from 'lucide-react';

const TYPE_ICONS = { video: Play, pdf: FileText, tp: Code };
const TYPE_LABELS = { video: 'Vidéo', pdf: 'Document', tp: 'TP' };

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const course = COURSES.find(c => c.id === parseInt(id));
  const [activeChapter, setActiveChapter] = useState(null);

  if (!course) return (
    <div className="page-container" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
      <h2>Cours introuvable</h2>
      <Link to="/courses" className="btn btn-primary" style={{ marginTop: 20 }}>Retour aux cours</Link>
    </div>
  );

  const completedCount = course.chapters.filter(c => c.completed).length;

  return (
    <div className="page-container">
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${course.color}20, ${course.color}05)`,
        border: `1px solid ${course.color}25`,
        borderRadius: 'var(--radius-xl)',
        padding: 32,
        marginBottom: 28,
        display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start',
      }}>
        <div style={{
          width: 80, height: 80,
          background: `${course.color}20`,
          border: `2px solid ${course.color}40`,
          borderRadius: 'var(--radius-lg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <BookOpen size={40} color={course.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <span className="badge badge-amber">{course.level}</span>
            <span className="badge badge-jade">{course.subject}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 24, marginBottom: 8 }}>{course.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16, maxWidth: 600 }}>{course.description}</p>
          <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={14} />{course.studentsCount} inscrits</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14} />{course.duration}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Star size={14} color="var(--amber)" />{course.rating}/5</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><BookOpen size={14} />{course.chaptersCount} chapitres</span>
          </div>
        </div>

        {/* Progress for enrolled students */}
        {user?.role === 'student' && course.isEnrolled && (
          <div style={{ minWidth: 200 }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Votre progression</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: course.color, marginBottom: 6 }}>{course.progress}%</div>
            <div className="progress-bar" style={{ height: 8, marginBottom: 8 }}>
              <div className="progress-fill" style={{ width: `${course.progress}%`, background: course.color }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{completedCount}/{course.chapters.length} chapitres terminés</div>
            <Link to="/ai-assistant" className="btn btn-secondary btn-sm" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
              <Brain size={14} /> Demander à Mɛsi
            </Link>
          </div>
        )}
      </div>

      {/* Chapters */}
      <div style={{ display: 'grid', gridTemplateColumns: course.chapters.length ? '1fr 340px' : '1fr', gap: 24 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: 16 }}>
            Contenu du cours — {course.chapters.length} chapitre{course.chapters.length > 1 ? 's' : ''}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {course.chapters.map((chapter, i) => {
              const Icon = TYPE_ICONS[chapter.type] || Play;
              const isActive = activeChapter === chapter.id;
              return (
                <div
                  key={chapter.id}
                  onClick={() => setActiveChapter(isActive ? null : chapter.id)}
                  style={{
                    background: isActive ? 'var(--bg-raised)' : 'var(--bg-surface)',
                    border: `1px solid ${isActive ? `${course.color}40` : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 18px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Step number / check */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: chapter.completed ? 'var(--jade)' : `${course.color}20`,
                    border: `2px solid ${chapter.completed ? 'var(--jade)' : `${course.color}40`}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 12, fontWeight: 700,
                    color: chapter.completed ? 'white' : course.color,
                  }}>
                    {chapter.completed ? <CheckCircle2 size={16} /> : i + 1}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{chapter.title}</div>
                    <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon size={11} /> {TYPE_LABELS[chapter.type]}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} /> {chapter.duration}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {isActive && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-primary btn-sm">
                        {chapter.type === 'video' ? <><Play size={13} /> Regarder</> : chapter.type === 'tp' ? <><Code size={13} /> Commencer TP</> : <><FileText size={13} /> Ouvrir</>}
                      </button>
                      <button className="btn btn-secondary btn-sm"><Download size={13} /></button>
                    </div>
                  )}

                  <ChevronRight size={16} color="var(--text-muted)" style={{ transform: isActive ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* AI Assistant card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(0,201,167,0.08))',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: 20,
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>🤖</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Assistant Mɛsi</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
              Posez vos questions sur ce cours. Mɛsi vous guide sans donner la réponse directement.
            </div>
            <Link to="/ai-assistant" className="btn btn-full" style={{ background: 'rgba(139,92,246,0.3)', color: 'var(--violet)', border: '1px solid rgba(139,92,246,0.4)', justifyContent: 'center', fontWeight: 600, fontSize: 13, borderRadius: 'var(--radius-md)', padding: '10px 16px' }}>
              <Brain size={14} /> Ouvrir Mɛsi
            </Link>
          </div>

          {/* Resources */}
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 14 }}>Ressources</div>
            {[
              { icon: '📄', label: 'Syllabus du cours', size: '245 Ko' },
              { icon: '📚', label: 'Bibliographie', size: '48 Ko' },
            ].map(({ icon, label, size }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{size}</div>
                </div>
                <button className="btn btn-ghost btn-sm"><Download size={13} /></button>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {course.tags.map(tag => (
                <span key={tag} style={{ fontSize: 12, padding: '4px 12px', background: `${course.color}15`, color: course.color, borderRadius: 100, border: `1px solid ${course.color}30` }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
