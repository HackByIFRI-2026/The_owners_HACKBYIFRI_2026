import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { COURSES, PROFESSOR_STATS } from '../data/mockData.js';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { Users, BookOpen, Star, Eye, PlusCircle, ArrowRight, TrendingUp } from 'lucide-react';

export default function ProfessorDashboard() {
  const { user } = useAuth();
  const stats = PROFESSOR_STATS;
  const firstName = user?.name?.split(' ').slice(-1)[0];

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 6 }}>
            Tableau de bord — <span style={{ color: 'var(--amber)', fontStyle: 'italic' }}>Prof. {firstName}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Suivez la progression de vos étudiants et gérez vos contenus pédagogiques.
          </p>
        </div>
        <Link to="/create-course" className="btn btn-primary">
          <PlusCircle size={16} /> Nouveau cours
        </Link>
      </div>

      {/* Stats */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { icon: BookOpen, label: 'Cours publiés', value: stats.totalCourses, color: 'amber' },
          { icon: Users, label: 'Étudiants inscrits', value: stats.totalStudents, color: 'jade', sub: 'Total cumulé' },
          { icon: Star, label: 'Note moyenne', value: `${stats.avgRating}/5`, color: 'amber', sub: '⭐⭐⭐⭐⭐' },
          { icon: Eye, label: 'Vues totales', value: stats.totalViews.toLocaleString(), color: 'violet' },
        ].map(({ icon: Icon, label, value, color, sub }) => (
          <div key={label} className={`stat-card ${color} animate-fade-in`}>
            <Icon size={18} color={`var(--${color})`} style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 2 }}>{value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{label}</div>
            {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: 20 }}>Activité hebdomadaire (vues)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={stats.weeklyActivity}>
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'var(--bg-raised)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} cursor={{ stroke: 'var(--amber-border)' }} />
              <Line type="monotone" dataKey="views" stroke="var(--amber)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: 20 }}>Score moyen par cours</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats.studentProgress} barSize={24}>
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip contentStyle={{ background: 'var(--bg-raised)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} formatter={v => [`${v}%`]} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="avgScore" fill="var(--jade)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Courses table */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700 }}>Mes cours</h3>
          <Link to="/my-courses" className="btn btn-ghost btn-sm" style={{ color: 'var(--amber)', fontSize: 13 }}>
            Gérer tous les cours <ArrowRight size={13} />
          </Link>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Cours', 'Étudiants', 'Progression moy.', 'Score moy.', 'Note', ''].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.studentProgress.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 20px', fontWeight: 500, fontSize: 14 }}>{row.name}</td>
                  <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--text-secondary)' }}>{row.students}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="progress-bar" style={{ width: 80 }}>
                        <div className="progress-fill jade" style={{ width: `${row.avgProgress}%` }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{row.avgProgress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 14, color: row.avgScore >= 70 ? 'var(--jade)' : row.avgScore >= 50 ? 'var(--amber)' : 'var(--coral)', fontWeight: 600 }}>{row.avgScore}%</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 13, color: 'var(--amber)' }}>★ {(3.8 + i * 0.2).toFixed(1)}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <Link to={`/my-courses`} className="btn btn-secondary btn-sm" style={{ fontSize: 12 }}>Voir</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {[
          { to: '/create-course', icon: '📚', label: 'Publier un cours', desc: 'Vidéo, PDF, exercices' },
          { to: '/students', icon: '👥', label: 'Mes étudiants', desc: 'Suivi & progression' },
          { to: '/stats', icon: '📊', label: 'Statistiques', desc: 'Analyses détaillées' },
        ].map(({ to, icon, label, desc }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }}>
            <div className="card card-hover" style={{ padding: 20 }}>
              <span style={{ fontSize: 28, display: 'block', marginBottom: 10 }}>{icon}</span>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
