import { ArrowRight, BookOpen, Video, Bot, Users, ArrowUpRight, CheckCircle, Smartphone, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
    return (
        <div className="bg-void text-primary font-body overflow-hidden">

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center pt-24 pb-20 border-b border-white/5">
                {/* Background Blobs for depth */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-violet/5 blur-[100px] rounded-full"></div>

                <div className="container mx-auto px-6 z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                        {/* Text Content */}
                        <div className="lg:col-span-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-3 px-4 py-2 bg-amber/10 border border-amber/20 rounded-full mb-8 shadow-sm"
                            >
                                <span className="w-2 h-2 bg-amber rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                <span className="font-mono text-xs uppercase tracking-widest text-amber font-semibold">L'excellence académique à portée de main</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-5xl md:text-7xl font-display font-medium text-primary leading-[1.1] mb-8"
                            >
                                Apprenez sans <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber to-jade italic font-serif">frontières.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-xl text-secondary mb-12 max-w-xl leading-relaxed"
                            >
                                Kplɔ́n nǔ est la plateforme d'apprentissage intelligente qui connecte les étudiants béninois à un savoir de qualité, assistée par l'IA <b>Mɛsi</b>.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-5"
                            >
                                <Link to="/register" className="btn btn-primary btn-lg group shadow-lg shadow-amber/10">
                                    Rejoindre maintenant
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/videos" className="btn btn-secondary btn-lg group">
                                    Voir les cours publics
                                    <Video size={18} className="text-muted group-hover:text-primary transition-colors" />
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                                className="mt-12 flex items-center gap-6"
                            >
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-void bg-raised flex items-center justify-center text-[10px] font-bold overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Student" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-void bg-amber flex items-center justify-center text-[10px] font-bold text-white">+2K</div>
                                </div>
                                <p className="text-xs text-muted font-mono uppercase tracking-wider">Rejoint par plus de 2,000 étudiants</p>
                            </motion.div>
                        </div>

                        {/* Visuel Human-Centered */}
                        <div className="lg:col-span-6 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
                                className="relative rounded-2xl overflow-hidden shadow-2xl z-10 aspect-[4/5] lg:aspect-auto"
                            >
                                <img
                                    src="/students_hero_1772623043371.png"
                                    alt="Étudiants apprenant ensemble"
                                    className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-60"></div>

                                {/* Floating UI card */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute bottom-8 left-8 right-8 p-6 bg-surface/80 backdrop-blur-md border border-white/10 rounded-xl"
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-10 h-10 bg-jade/20 rounded-full flex items-center justify-center">
                                            <CheckCircle size={20} className="text-jade" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">Concept Maîtrisé</div>
                                            <div className="text-xs text-muted font-mono">Algorithmique Graphes</div>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-void rounded-full overflow-hidden">
                                        <div className="h-full bg-jade w-4/5 animate-pulse"></div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Decorative element */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet/10 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-jade/10 rounded-full blur-[80px] -z-10"></div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section id="ecosystem" className="py-32 bg-deep border-b border-white/5 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="font-mono text-xs text-amber tracking-widest uppercase block mb-4">01 — L'Écosystème</span>
                        <h2 className="text-4xl md:text-5xl font-display text-primary mb-6">Tout ce dont vous avez besoin pour réussir.</h2>
                        <p className="text-secondary text-lg">
                            Une infrastructure complète alliant interaction humaine et intelligence artificielle pour un apprentissage sans friction.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureItem
                            icon={<Bot size={32} className="text-amber" />}
                            title="Assistant IA Mɛsi"
                            description="Votre tuteur personnel disponible 24/7. Mɛsi ne vous donne pas la réponse, il vous guide pour que vous la trouviez vous-même."
                        />
                        <FeatureItem
                            icon={<Video size={32} className="text-jade" />}
                            title="Cours & Lives"
                            description="Accédez aux sessions en direct de vos professeurs ou révisez à votre rythme avec les archives vidéo haute définition."
                        />
                        <FeatureItem
                            icon={<Shield size={32} className="text-violet" />}
                            title="Salles Sécurisées"
                            description="Un espace dédié pour chaque classe sous la direction d'un professeur. Soumettez vos travaux et recevez des corrections détaillées."
                        />
                    </div>
                </div>
            </section>

            {/* --- HUMAN PROOF SECTION --- */}
            <section className="py-32 bg-void">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                                className="rounded-2xl overflow-hidden shadow-2xl"
                            >
                                <img
                                    src="/professor_teaching_1772623372106.png"
                                    alt="Professeur enseignant"
                                    className="w-full aspect-[4/3] object-cover"
                                />
                            </motion.div>
                            <div className="absolute -bottom-6 -right-6 p-8 bg-surface border border-white/5 rounded-2xl shadow-xl max-w-xs">
                                <p className="text-sm italic mb-4">"Kplɔ́n nǔ a transformé ma façon d'interagir avec mes étudiants. L'IA Mɛsi les aide à préparer le terrain."</p>
                                <div className="text-xs font-bold font-mono text-amber">— Prof. Abdou, Informatique</div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <span className="font-mono text-xs text-jade tracking-widest uppercase block mb-4">02 — La Vision</span>
                            <h2 className="text-4xl font-display text-primary mb-8">L'éducation comme levier de transformation.</h2>
                            <div className="space-y-6">
                                <CheckItem title="Accessibilité Maximale" text="Interface optimisée pour les connexions bas débit et usage mobile." />
                                <CheckItem title="Apprentissage Adaptatif" text="Des quiz et flashcards générés automatiquement par l'IA selon votre progression." />
                                <CheckItem title="Communauté Solidaire" text="Échanges directs entre étudiants et professeurs dans des cellules d'étude." />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING SECTION --- */}
            <section id="pricing" className="py-32 bg-deep border-b border-white/5 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="font-mono text-xs text-amber tracking-widest uppercase block mb-4">03 — Tarification</span>
                        <h2 className="text-4xl md:text-5xl font-display text-primary mb-6">Investissez dans votre réussite.</h2>
                        <p className="text-secondary text-lg">
                            Des plans adaptés à tous les profils, de l'étudiant curieux à l'institution ambitieuse.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Tier Gratiuit */}
                        <div className="p-10 rounded-3xl bg-surface/40 border border-white/5 flex flex-col hover:border-white/10 transition-colors">
                            <h3 className="text-xl font-bold mb-2 text-primary">Découverte</h3>
                            <div className="text-4xl font-display mb-4 text-primary">Gratuit</div>
                            <p className="text-sm text-secondary mb-8">Idéal pour explorer la bibliothèque publique.</p>
                            <ul className="space-y-5 mb-10 flex-1">
                                <CheckItem title="Accès aux vidéos publiques" text="" />
                                <CheckItem title="Profil étudiant simple" text="" />
                                <CheckItem title="Rejoindre 1 salle de classe" text="" />
                            </ul>
                            <Link to="/register" className="btn btn-secondary w-full text-center block">Commencer</Link>
                        </div>

                        {/* Tier Premium */}
                        <div className="p-10 rounded-3xl bg-gradient-to-b from-surface to-deep border border-amber/30 relative flex flex-col shadow-2xl shadow-amber/5 transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-amber text-void text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                                Recommandé
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-primary">Premium</h3>
                            <div className="text-4xl font-display mb-1 text-primary">4.900 FCFA<span className="text-lg text-muted font-normal">/mois</span></div>
                            <p className="text-sm text-secondary mb-8">L'expérience d'apprentissage sans limite avec l'IA.</p>
                            <ul className="space-y-5 mb-10 flex-1">
                                <CheckItem title="Toutes les vidéos & cours" text="" />
                                <CheckItem title="Requêtes illimitées IA Mɛsi" text="" />
                                <CheckItem title="Salles de classes illimitées" text="" />
                                <CheckItem title="Génération automatique de Quiz" text="" />
                            </ul>
                            <Link to="/register" className="btn btn-primary w-full text-center block shadow-[0_0_15px_rgba(245,158,11,0.2)]">Devenir Premium</Link>
                        </div>

                        {/* Tier Institution */}
                        <div className="p-10 rounded-3xl bg-surface/40 border border-white/5 flex flex-col hover:border-white/10 transition-colors">
                            <h3 className="text-xl font-bold mb-2 text-primary">Institution</h3>
                            <div className="text-4xl font-display mb-4 text-primary">Sur devis</div>
                            <p className="text-sm text-secondary mb-8">Pour les universités et écoles supérieures.</p>
                            <ul className="space-y-5 mb-10 flex-1">
                                <CheckItem title="Licences étudiantes groupées" text="" />
                                <CheckItem title="Comptes professeurs vérifiés" text="" />
                                <CheckItem title="Tableau de bord administrateur" text="" />
                                <CheckItem title="Support dédié 24/7" text="" />
                            </ul>
                            <a href="mailto:contact@kplon-nu.com" className="btn btn-secondary w-full text-center block">Nous contacter</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-24 px-6">
                <div className="container mx-auto">
                    <div className="bg-gradient-to-br from-surface to-deep border border-amber/20 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>

                        <h2 className="text-4xl md:text-6xl font-display mb-8 relative z-10">Prêt à transformer votre futur ?</h2>
                        <p className="text-secondary text-lg mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed">
                            Rejoignez des milliers d'étudiants d'IFRI et d'ailleurs. L'admission est gratuite pour la session actuelle.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                            <Link to="/register" className="btn btn-primary btn-xl">Commencer l'Inscription</Link>
                            <Link to="/login" className="btn btn-secondary btn-xl">Accéder à mon Espace</Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

const FeatureItem = ({ icon, title, description }) => (
    <div className="p-8 bg-surface/40 border border-white/5 rounded-2xl hover:border-amber/30 transition-all duration-300 group">
        <div className="mb-6 p-4 bg-raised rounded-xl w-fit group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-display mb-4 text-primary">{title}</h3>
        <p className="text-secondary text-sm leading-relaxed">{description}</p>
    </div>
);

const CheckItem = ({ title, text }) => (
    <div className="flex gap-4">
        <div className="mt-1 w-5 h-5 rounded-full bg-jade/20 flex items-center justify-center shrink-0">
            <CheckCircle size={14} className="text-jade" />
        </div>
        <div>
            <h4 className="font-bold text-primary mb-1">{title}</h4>
            <p className="text-secondary text-sm">{text}</p>
        </div>
    </div>
);

export default HomePage;
