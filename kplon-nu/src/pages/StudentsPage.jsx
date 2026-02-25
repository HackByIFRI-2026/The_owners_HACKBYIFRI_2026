import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, BookOpen, Award } from 'lucide-react';

const STUDENTS = [
  { id: 1, name: 'Fifamè Legba', email: 'fifame.legba@gmail.com', course: 'Algorithmes', progress: 65, quizScore: 72, lastActive: '2h', streak: 7 },
  { id: 2, name: 'Kodjo Mensah', email: 'kodjo.m@gmail.com', course: 'Algorithmes', progress: 42, quizScore: 58, lastActive: '1j', streak: 2 },
  { id: 3, name: 'Aicha Dembele', email: 'aicha.d@gmail.com', course: 'Bases de Données', progress: 88, quizScore: 91, lastActive: '3h', streak: 14 },
  { id: 4, name: 'Moise Agossou', email: 'moise.a@gmail.com', course: 'React.js', progress: 20, quizScore: 45, lastActive: '3j', streak: 0 },
  { id: 5, name: 'Clémence Ahloh', email: 'clemence.a@gmail.com', course: 'Algorithmes', progress: 78, quizScore: 83, lastActive: '30min', streak: 21 },
  { id: 6, name: 'Rostand Kpodo', email: 'rostand.k@gmail.com', course: 'Bases de Données', progress: 55, quizScore: 67, lastActive: '5h', streak: 4 },
];

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = STUDENTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'good' && s.quizScore >= 70) || (filter === 'risk' && s.quizScore < 60);
    return matchSearch && matchFilter;
  });

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Mes étudiants</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{STUDENTS.length} étudiants inscrits à vos cours</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input-field" placeholder="Rechercher un étudiant..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 42, margin: 0 }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['all', 'Tous'], ['good', '✅ En bonne voie'], ['risk', '⚠️ À risque']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} className={`btn btn-sm ${filter === val ? 'btn-primary' : 'btn-secondary'}`}>{label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Étudiant', 'Cours', 'Progression', 'Score quiz', 'Streak', 'Dernière activité', ''].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(student => {
              const initials = student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
              const isRisk = student.quizScore < 60;
              const isGood = student.quizScore >= 80;
              return (
                <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>{initials}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{student.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>{student.course}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="progress-bar" style={{ width: 80 }}>
                        <div className="progress-fill" style={{ width: `${student.progress}%`, background: student.progress >= 70 ? 'var(--jade)' : 'var(--amber)' }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{student.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isGood ? <TrendingUp size={13} color="var(--jade)" /> : isRisk ? <TrendingDown size={13} color="var(--coral)" /> : null}
                      <span style={{ fontSize: 14, fontWeight: 600, color: isGood ? 'var(--jade)' : isRisk ? 'var(--coral)' : 'var(--amber)' }}>{student.quizScore}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {student.streak > 0 ? (
                      <span style={{ fontSize: 13 }}>🔥 {student.streak}j</span>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-muted)' }}>Il y a {student.lastActive}</td>
                  <td style={{ padding: '14px 20px' }}>
                    {isRisk && (
                      <span className="badge badge-coral" style={{ fontSize: 11 }}>⚠️ À risque</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Aucun étudiant trouvé
          </div>
        )}
      </div>
    </div>
  );
}
