import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { COURSES, STUDENT_STATS } from '../data/mockData.js';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { BookOpen, Brain, Target, Zap, Clock, TrendingUp, ArrowRight, Star, Play } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const stats = STUDENT_STATS;
  const enrolledCourses = COURSES.filter(c => c.isEnrolled);
  const firstName = user?.name?.split(' ')[0];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, marginBottom: 6 }}>
              {greeting()}, <span style={{ color: 'var(--amber)', fontStyle: 'italic' }}>{firstName}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              Continuez votre apprentissage — vous êtes sur la bonne voie !
            </p>
          </div>
          {/* Streak badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--amber-glow)',
            border: '1px solid var(--amber-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 20px',
          }}>
            <span style={{ fontSize: 28 }}>🔥</span>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--amber)', fontSize: 20 }}>{user?.streak} jours</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Série en cours</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily challenge banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(240,165,0,0.15), rgba(0,201,167,0.08))',
        border: '1px solid var(--amber-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 32 }}>⚡</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Défi journalier disponible !</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>5 questions sur "Complexité algorithmique" — gagnez 50 pts</div>
          </div>
        </div>
        <Link to="/quiz" className="btn btn-primary">
          Relever le défi <ArrowRight size={15} />
        </Link>
      </div>

      {/* Stats grid */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { icon: BookOpen, label: 'Cours suivis', value: stats.totalCourses, color: 'amber', sub: `${stats.completedChapters} chapitres terminés` },
          { icon: Zap, label: 'Points', value: stats.totalPoints.toLocaleString(), color: 'amber', sub: 'Niveau Intermédiaire' },
          { icon: Target, label: 'Moy. quiz', value: `${stats.quizAverage}%`, color: 'jade', sub: '+5% cette semaine' },
          { icon: Clock, label: 'Temps semaine', value: `${stats.weeklyTime}h`, color: 'violet', sub: 'Objectif: 6h' },
        ].map(({ icon: Icon, label, value, color, sub }) => (
          <div key={label} className={`stat-card ${color} animate-fade-in`}>
            <Icon size={18} color={`var(--${color})`} style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 2 }}>{value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Two columns: courses + chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginBottom: 28 }}>
        {/* Courses in progress */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700 }}>Cours en cours</h3>
            <Link to="/courses" className="btn btn-ghost btn-sm" style={{ fontSize: 13, color: 'var(--amber)' }}>
              Voir tout <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {enrolledCourses.map(course => (
              <Link key={course.id} to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                <div className="card card-hover" style={{ padding: 18, display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: course.color + '20',
                    border: `2px solid ${course.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <BookOpen size={22} color={course.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {course.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{course.professor}</span>
                      <span className="badge badge-amber" style={{ fontSize: 10 }}>{course.level}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{ width: `${course.progress}%`, background: course.color }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{course.progress}%</span>
                    </div>
                  </div>
                  <Play size={16} color="var(--text-muted)" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Weekly activity chart */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: 16 }}>Activité hebdomadaire</h3>
          <div className="card" style={{ padding: 20 }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.progression} barSize={20}>
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-raised)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
                  formatter={v => [`${v} min`, 'Temps']}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Bar dataKey="time" fill="var(--amber)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
              Total: <strong style={{ color: 'var(--amber)' }}>{stats.weeklyTime}h</strong> cette semaine
            </div>
          </div>

          {/* Subject radar */}
          <div className="card" style={{ padding: 20, marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Performance par matière</div>
            <ResponsiveContainer width="100%" height={160}>
              <RadarChart data={stats.subjectScores}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Radar name="Score" dataKey="score" stroke="var(--jade)" fill="var(--jade)" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: 16 }}>Accès rapide</h3>
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { to: '/ai-assistant', icon: '🤖', label: 'Demander à Mɛsi', desc: 'Assistant IA pédagogique', color: 'var(--violet)' },
            { to: '/flashcards', icon: '🗂️', label: 'Réviser', desc: `${stats.masteredFlashcards} cartes à revoir`, color: 'var(--jade)' },
            { to: '/quiz', icon: '🎯', label: 'Faire un quiz', desc: 'Testez vos connaissances', color: 'var(--amber)' },
            { to: '/progress', icon: '📈', label: 'Ma progression', desc: 'Points faibles & forces', color: 'var(--coral)' },
          ].map(({ to, icon, label, desc, color }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div className="card card-hover" style={{ padding: 18 }}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 10 }}>{icon}</span>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
