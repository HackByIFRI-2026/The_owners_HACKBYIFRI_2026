import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { COURSES } from '../data/mockData.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { BookOpen, Search, Filter, Clock, Users, Star, Play, Lock } from 'lucide-react';

export default function CoursesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const isStudent = user?.role === 'student';

  const filtered = COURSES.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'enrolled' && c.isEnrolled) || (filter === 'available' && !c.isEnrolled);
    return matchSearch && matchFilter;
  });

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ marginBottom: 6, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22 }}>
          {isStudent ? 'Catalogue des cours' : 'Mes cours publiés'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {isStudent ? `${COURSES.filter(c => c.isEnrolled).length} cours en cours · ${COURSES.length} disponibles` : `${COURSES.length} cours · ${COURSES.reduce((a, c) => a + c.studentsCount, 0)} étudiants inscrits`}
        </p>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input-field"
            placeholder="Rechercher un cours..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 42, margin: 0 }}
          />
        </div>
        {isStudent && (
          <div style={{ display: 'flex', gap: 8 }}>
            {[['all', 'Tous'], ['enrolled', 'Mes cours'], ['available', 'Disponibles']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`btn btn-sm ${filter === val ? 'btn-primary' : 'btn-secondary'}`}
              >{label}</button>
            ))}
          </div>
        )}
      </div>

      {/* Courses grid */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {filtered.map(course => (
          <Link key={course.id} to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
            <div className="card card-hover animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Course header */}
              <div style={{
                height: 120,
                background: `linear-gradient(135deg, ${course.color}30, ${course.color}10)`,
                borderBottom: `1px solid ${course.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <BookOpen size={40} color={course.color} style={{ opacity: 0.7 }} />
                <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
                  <span className="badge badge-muted" style={{ fontSize: 11 }}>{course.level}</span>
                  {isStudent && course.isEnrolled && <span className="badge badge-jade" style={{ fontSize: 11 }}>Inscrit</span>}
                  {isStudent && !course.isEnrolled && <span className="badge badge-muted" style={{ fontSize: 11 }}>Disponible</span>}
                </div>
                {course.tags.slice(0, 2).map(tag => null)}
              </div>

              {/* Course body */}
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, lineHeight: 1.4 }}>{course.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {course.description}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {course.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 11, padding: '2px 8px', background: `${course.color}15`, color: course.color, borderRadius: 100, border: `1px solid ${course.color}30` }}>{tag}</span>
                  ))}
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} />{course.studentsCount}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} />{course.duration}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={12} color="var(--amber)" />{course.rating}</span>
                </div>

                {/* Progress for enrolled */}
                {isStudent && course.isEnrolled && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      <span>Progression</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${course.progress}%`, background: course.color }} />
                    </div>
                  </div>
                )}

                {/* Action */}
                <div style={{ marginTop: 14 }}>
                  {isStudent ? (
                    course.isEnrolled ? (
                      <div className="btn btn-primary btn-full btn-sm">
                        <Play size={14} /> Continuer
                      </div>
                    ) : (
                      <div className="btn btn-secondary btn-full btn-sm">
                        S'inscrire au cours
                      </div>
                    )
                  ) : (
                    <div className="btn btn-secondary btn-full btn-sm">
                      Gérer ce cours
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
