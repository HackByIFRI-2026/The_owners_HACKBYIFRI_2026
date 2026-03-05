import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { TrendingUp, Target, Clock, BookOpen, Star, Award, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { userService } from '../services/services';

export default function ProgressPage() {
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        userService.getMyStats()
            .then(({ data }) => setStatsData(data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    return (
        <div className="page-container">
            <div className="mb-10">
                <h2 className="text-2xl font-display text-primary mb-2">Ma Progression</h2>
                <p className="text-secondary text-sm">Analysez vos performances et vos points d'amélioration.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">

                {/* Activity Chart */}
                <div className="card p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber/10 rounded-lg text-amber"><TrendingUp size={20} /></div>
                            <h3 className="font-bold text-primary">Activité de la semaine</h3>
                        </div>
                        <span className="text-xs font-mono text-muted uppercase">Points d'XP</span>
                    </div>
                    <div className="h-[250px] w-full">
                        {loading ? (
                            <div className="h-full w-full flex items-center justify-center"><Loader2 size={32} className="animate-spin text-amber/40" /></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statsData?.activityLog || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px' }}
                                        itemStyle={{ color: 'var(--amber)' }}
                                    />
                                    <Bar dataKey="points" fill="var(--amber)" radius={[4, 4, 0, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Radar Chart Skills */}
                <div className="card p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-jade/10 rounded-lg text-jade"><Target size={20} /></div>
                        <h3 className="font-bold text-primary">Radar de Compétences</h3>
                    </div>
                    <div className="h-[250px] w-full">
                        {loading ? (
                            <div className="h-full w-full flex items-center justify-center"><Loader2 size={32} className="animate-spin text-jade/40" /></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={statsData?.skills || []}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                                    <Radar
                                        name="Étudiant" dataKey="A" stroke="var(--jade)"
                                        fill="var(--jade)" fillOpacity={0.5}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatSmall label="Session Totales" value={loading ? '-' : statsData?.stats?.sessionsTotal || 0} icon={<Clock />} color="amber" />
                <StatSmall label="Quiz Réussis" value={loading ? '-' : statsData?.stats?.quizPassed || 0} icon={<Award />} color="jade" />
                <StatSmall label="Flashcards" value={loading ? '-' : statsData?.stats?.flashcards || 0} icon={<Star />} color="violet" />
                <StatSmall label="Salles Actives" value={loading ? '-' : statsData?.stats?.activeClassrooms || 0} icon={<BookOpen />} color="coral" />
            </div>
        </div>
    );
}

const StatSmall = ({ label, value, icon, color }) => (
    <div className={`card p-6 border-l-4 border-l-${color}`}>
        <div className="flex items-center gap-4">
            <div className={`p-2 bg-${color}/10 rounded-lg text-${color}`}>{icon}</div>
            <div>
                <div className="text-xs text-muted uppercase font-mono">{label}</div>
                <div className="text-2xl font-display text-primary">{value}</div>
            </div>
        </div>
    </div>
);
