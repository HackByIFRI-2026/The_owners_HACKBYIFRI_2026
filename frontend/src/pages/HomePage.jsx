import { ArrowRight, BookOpen, Video, Bot, Users, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
    return (
        <div className="bg-void text-primary font-body overflow-hidden">

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 border-b border-white/5">
                {/* Subtle structural grid background */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                <div className="container mx-auto px-6 z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Text Content */}
                        <div className="lg:col-span-7 staggger">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-3 px-4 py-2 bg-surface border border-amber-border rounded-sm mb-8"
                            >
                                <span className="w-2 h-2 bg-amber rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                <span className="font-mono text-xs uppercase tracking-widest text-amber">Kplɔ́n nǔ _ v1.0.0</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-5xl md:text-7xl font-display font-medium text-primary leading-[1.1] mb-8"
                            >
                                L'Académie Numérique <br />
                                <span className="text-secondary italic font-serif">Béninoise.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-lg text-secondary mb-12 max-w-xl leading-relaxed border-l-2 border-amber/30 pl-6"
                            >
                                Une approche rigoureuse de l'apprentissage contemporain.
                                Des grimoires numériques aux laboratoires virtuels, assistés par la conscience artificielle Mɛsi.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <Link to="/register" className="btn btn-primary group">
                                    Initier l'admission
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/courses" className="btn btn-secondary group">
                                    Consulter les archives publiques
                                    <ArrowUpRight size={16} className="text-muted group-hover:text-primary transition-colors" />
                                </Link>
                            </motion.div>
                        </div>

                        {/* Visual/Abstract representation of AI Academic approach */}
                        <div className="lg:col-span-5 hidden lg:flex justify-end relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
                                className="relative w-[400px] h-[500px] border border-white/10 bg-surface rounded-sm p-4 overflow-hidden"
                            >
                                {/* Structural elements imitating a futuristic book/console */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-glow blur-3xl rounded-full"></div>
                                <div className="absolute top-4 left-4 w-12 h-1 bg-amber/50"></div>
                                <div className="absolute bottom-4 right-4 flex gap-2">
                                    <div className="w-1 h-1 bg-secondary"></div>
                                    <div className="w-1 h-1 bg-secondary"></div>
                                    <div className="w-1 h-1 bg-amber"></div>
                                </div>

                                <div className="h-full w-full border border-white/5 bg-deep/50 p-6 flex flex-col justify-between font-mono text-xs text-muted relative z-10">
                                    <div className="flex justify-between border-b border-white/10 pb-4">
                                        <span>SYS.Mɛsi.Core</span>
                                        <span className="text-jade">Actif</span>
                                    </div>
                                    <div className="space-y-4 my-auto">
                                        <div className="h-2 w-3/4 bg-raised"></div>
                                        <div className="h-2 w-1/2 bg-raised"></div>
                                        <div className="h-2 w-5/6 bg-raised"></div>
                                        <div className="h-2 w-2/3 bg-amber/20 mt-8"></div>
                                        <p className="text-secondary opacity-70 mt-2">» Analyse des requêtes étudiants en cours...</p>
                                    </div>
                                    <div className="flex justify-between border-t border-white/10 pt-4">
                                        <span>Flux: Salles [04]</span>
                                        <span>Taux de réponse: 99.8%</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- INFRASTRUCTURE SECTION --- */}
            <section className="py-32 bg-deep border-b border-white/5">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-8">
                        <div className="max-w-2xl">
                            <span className="font-mono text-xs text-amber tracking-widest uppercase block mb-4">01 — L'Infrastructure</span>
                            <h2 className="text-3xl font-display text-primary">Les Piliers de l'Académie</h2>
                        </div>
                        <p className="text-secondary text-sm max-w-sm font-mono border-l border-white/10 pl-4">
                            Notre architecture numérique est conçue pour maximiser la rétention des connaissances et l'interaction ciblée.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <NodeCard
                            number="001"
                            icon={<Bot size={24} className="text-amber" />}
                            title="Entité Mɛsi"
                            description="Algorithme d'assistance pédagogique. Capable de vulgariser des concepts complexes et de générer des cartes d'ancrage mémoriel."
                        />
                        <NodeCard
                            number="002"
                            icon={<Video size={24} className="text-jade" />}
                            title="Transmission Live"
                            description="Canaux de communication synchrones à haute fidélité pour les séminaires magistraux, avec journalisation des présences."
                        />
                        <NodeCard
                            number="003"
                            icon={<BookOpen size={24} className="text-coral" />}
                            title="Chambre des Savoirs"
                            description="Dépôt asynchrone de manuscrits (PDF) et archives audiovisuelles publiques accessibles à tous les initiés."
                        />
                        <NodeCard
                            number="004"
                            icon={<Users size={24} className="text-violet" />}
                            title="Cellules d'Étude"
                            description="Espaces reclus sous la tutelle d'un professeur pour la distribution d'épreuves et l'évaluation rigoureuse."
                        />
                    </div>
                </div>
            </section>

            {/* --- METRICS / CTA --- */}
            <section className="py-24 bg-void relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-1/2 h-full bg-surface skew-x-12 translate-x-32 border-l border-white/5 z-0"></div>
                <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-display mb-6">Prêt à intégrer le cursus ?</h2>
                        <p className="text-secondary font-mono text-sm leading-relaxed mb-8">
                            L'accès aux laboratoires et aux cellules d'études privées nécessite une accréditation formelle.
                            Les inscriptions pour la prochaine session académique sont ouvertes.
                        </p>
                        <Link to="/register" className="btn btn-primary">Déposer une candidature</Link>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-12 md:mt-0 font-mono text-sm border-l border-white/10 pl-8">
                        <div>
                            <span className="block text-3xl font-display text-amber mb-2">~</span>
                            <span className="text-muted uppercase tracking-widest text-xs">Périmètre de cours</span>
                            <p className="text-primary mt-1">Illimité</p>
                        </div>
                        <div>
                            <span className="block text-3xl font-display text-jade mb-2">~</span>
                            <span className="text-muted uppercase tracking-widest text-xs">Latence Mɛsi</span>
                            <p className="text-primary mt-1">&lt; 1500ms</p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

const NodeCard = ({ number, icon, title, description }) => {
    return (
        <div className="card card-hover group flex flex-col h-full bg-surface border-white/5 relative overflow-hidden rounded-sm hover:border-amber/30">
            {/* Structural decoration */}
            <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-muted opacity-50">{number}</div>
            <div className="absolute top-full left-0 w-full h-[1px] bg-amber/50 group-hover:top-0 transition-all duration-500"></div>

            <div className="w-12 h-12 flex items-center justify-center border border-white/10 bg-raised mb-8 rounded-sm shrink-0">
                {icon}
            </div>

            <h3 className="text-xl font-display text-primary mb-3">{title}</h3>
            <p className="text-secondary text-sm font-body leading-relaxed flex-grow">
                {description}
            </p>

            <div className="mt-8 flex items-center gap-2 text-xs font-mono text-muted group-hover:text-amber transition-colors">
                <div className="w-4 h-px bg-current"></div>
                <span>Initialiser</span>
            </div>
        </div>
    );
};

export default HomePage;
