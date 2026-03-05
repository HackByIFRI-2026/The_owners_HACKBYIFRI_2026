import { useState, useEffect } from 'react';
import { Users, Search, Filter, Mail, MoreVertical, CheckCircle, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { classroomService } from '../services/services';

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        classroomService.getMyStudentsStats()
            .then(({ data }) => setStudents(data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || s.status === filter;
        return matchesSearch && matchesFilter;
    });

    const activeCount = students.length;
    const onTrackCount = students.filter(s => s.status === 'on-track').length;
    const atRiskCount = students.filter(s => s.status === 'at-risk').length;
    const onTrackPct = activeCount ? Math.round((onTrackCount / activeCount) * 100) : 0;
    const atRiskPct = activeCount ? Math.round((atRiskCount / activeCount) * 100) : 0;

    return (
        <div className="page-container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h2 className="text-2xl font-display text-primary mb-2">Suivi des Étudiants</h2>
                    <p className="text-secondary text-sm">Visualisez la progression et les performances de vos élèves.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                            type="text" placeholder="Rechercher..."
                            className="input-field pl-10 mb-0"
                            value={search} onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="stat-card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-jade/10 rounded-lg text-jade"><Users size={20} /></div>
                        <span className="text-xs font-mono text-muted">TOTAL</span>
                    </div>
                    <div className="text-3xl font-display text-primary mb-1">{activeCount}</div>
                    <div className="text-xs text-muted font-medium">ÉTUDIANTS ACTIFS</div>
                </div>
                <div className="stat-card jade">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-jade/20 rounded-lg text-jade"><CheckCircle size={20} /></div>
                        <span className="text-xs font-mono text-jade">{onTrackPct}%</span>
                    </div>
                    <div className="text-3xl font-display text-jade mb-1">{onTrackCount}</div>
                    <div className="text-xs text-jade/70 font-medium">EN BONNE VOIE</div>
                </div>
                <div className="stat-card coral">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-coral/20 rounded-lg text-coral"><AlertTriangle size={20} /></div>
                        <span className="text-xs font-mono text-coral">{atRiskPct}%</span>
                    </div>
                    <div className="text-3xl font-display text-coral mb-1">{atRiskCount}</div>
                    <div className="text-xs text-coral/70 font-medium">À SURVEILLER</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter === 'all' ? 'bg-amber text-void' : 'bg-surface border border-white/5 text-secondary'}`}>Tous</button>
                <button onClick={() => setFilter('on-track')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter === 'on-track' ? 'bg-jade text-void' : 'bg-surface border border-white/5 text-secondary'}`}>En bonne voie</button>
                <button onClick={() => setFilter('at-risk')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter === 'at-risk' ? 'bg-coral text-void' : 'bg-surface border border-white/5 text-secondary'}`}>À risque</button>
            </div>

            {/* Table */}
            <div className="card overflow-x-auto p-0">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-raised/50">
                            <th className="p-4 text-xs font-mono text-muted uppercase tracking-widest">Étudiant</th>
                            <th className="p-4 text-xs font-mono text-muted uppercase tracking-widest">Filière / Année</th>
                            <th className="p-4 text-xs font-mono text-muted uppercase tracking-widest">Progression</th>
                            <th className="p-4 text-xs font-mono text-muted uppercase tracking-widest">Moyenne Quiz</th>
                            <th className="p-4 text-xs font-mono text-muted uppercase tracking-widest">Status</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="p-12 text-center text-muted">
                                    <Loader2 size={32} className="animate-spin mx-auto mb-4 opacity-50" />
                                    <p>Chargement des étudiants...</p>
                                </td>
                            </tr>
                        ) : filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-12 text-center text-muted">
                                    <Users size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Aucun étudiant trouvé.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((s, i) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                    key={s.id} className="hover:bg-amber/5 transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="avatar w-8 h-8 text-[10px]">{s.name.split(' ').map(x => x[0]).join('')}</div>
                                            <div>
                                                <div className="text-sm font-bold text-primary">{s.name}</div>
                                                <div className="text-[10px] text-muted font-mono">{s.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xs text-secondary">{s.major} — {s.year}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-1.5 flex-1 bg-void rounded-full overflow-hidden min-w-[100px]">
                                                <div className={`h-full rounded-full ${s.status === 'at-risk' ? 'bg-coral' : 'bg-jade'}`} style={{ width: `${s.progress}%` }}></div>
                                            </div>
                                            <span className="text-xs font-mono font-bold text-secondary">{s.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp size={12} className={s.score > 70 ? 'text-jade' : 'text-coral'} />
                                            <span className="text-sm font-bold text-primary">{s.score}/100</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${s.status === 'on-track' ? 'bg-jade/10 text-jade border border-jade/20' : 'bg-coral/10 text-coral border border-coral/20'}`}>
                                            {s.status === 'on-track' ? 'Régulier' : 'Irrégulier'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 text-muted hover:text-primary"><Mail size={16} /></button>
                                    </td>
                                </motion.tr>
                            )))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
