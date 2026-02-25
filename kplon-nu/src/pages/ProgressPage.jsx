import React from 'react';
import { STUDENT_STATS, COURSES } from '../data/mockData.js';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { TrendingUp, TrendingDown, Minus, BookOpen, Clock, Zap, Target } from 'lucide-react';

export default function ProgressPage() {
  const stats = STUDENT_STATS;
  const enrolled = COURSES.filter(c => c.isEnrolled);

  const weeklyData = stats.progression;

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Ma progression</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Suivez vos performances et identifiez vos points faibles</p>
      </div>

      {/* Overview stats */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { icon: Zap, label: 'Points', value: stats.totalPoints.toLocaleString(), color: 'amber', trend: '+120 cette semaine' },
          { icon: Target, label: 'Moy. quiz', value: `${stats.quizAverage}%`, color: 'jade', trend: '+5% vs semaine dernière' },
          { icon: Clock, label: 'Temps total', value: `${(stats.weeklyTime * 4).toFixed(0)}h`, color: 'violet', trend: 'Ce mois-ci' },
          { icon: BookOpen, label: 'Chapitres', value: stats.completedChapters, color: 'coral', trend: 'Terminés' },
        ].map(({ icon: Icon, label, value, color, trend }) => (
          <div key={label} className={`stat-card ${color} animate-fade-in`}>
            <Icon size={17} color={`var(--${color})`} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 2 }}>{value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{trend}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>⏱ Temps d'étude (minutes/jour)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barSize={22}>
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'var(--bg-raised)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} formatter={v => [`${v} min`]} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="time" fill="var(--amber)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>🎯 Maîtrise par matière</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={stats.subjectScores} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="var(--jade)" fill="var(--jade)" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-course progress */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Progression par cours</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {enrolled.map(course => (
            <div key={course.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: `${course.color}20`, border: `2px solid ${course.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <BookOpen size={20} color={course.color} />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{course.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: `${course.progress}%`, background: course.color }} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: course.color, minWidth: 40 }}>{course.progress}%</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--jade)' }}>
                      {course.chapters.filter(c => c.completed).length}/{course.chapters.length}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Chapitres</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--amber)' }}>{course.rating}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>★ Note</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak points */}
      <div className="card">
        <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>⚡ Points à améliorer</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {[
            { topic: 'Graphes et parcours', score: 45, course: 'Algorithmes', icon: '📉' },
            { topic: 'Formes normales BDD', score: 52, course: 'Bases de Données', icon: '📉' },
            { topic: 'Hooks React avancés', score: 60, course: 'React.js', icon: '📊' },
          ].map(({ topic, score, course, icon }) => (
            <div key={topic} style={{
              background: 'var(--bg-raised)',
              border: '1px solid rgba(255,107,107,0.2)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
            }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{topic}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{course}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="progress-bar" style={{ flex: 1, height: 4 }}>
                  <div className="progress-fill" style={{ width: `${score}%`, background: score >= 60 ? 'var(--amber)' : 'var(--coral)' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: score >= 60 ? 'var(--amber)' : 'var(--coral)' }}>{score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
