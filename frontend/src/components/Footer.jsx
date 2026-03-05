import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-deep text-secondary py-16 border-t border-white/5 mt-auto">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">

                {/* Brand & Manifesto */}
                <div className="md:col-span-5">
                    <h3 className="font-display font-medium text-3xl text-primary mb-6">Kplɔ́n nǔ</h3>
                    <p className="text-muted text-sm leading-relaxed max-w-sm mb-8 font-mono">
                        "Apprendre ensemble, grandir ensemble." <br /><br />
                        Une plateforme éducative ancrée dans l'excellence académique béninoise et propulsée par des algorithmes conscients.
                    </p>
                    <div className="flex items-center gap-3 text-xs font-mono text-muted">
                        <div className="h-px w-8 bg-white/10"></div>
                        <span>Architecturé par The Owners</span>
                        <div className="h-px w-8 bg-white/10"></div>
                    </div>
                </div>

                {/* Navigation Columns */}
                <div className="md:col-span-3 md:col-start-7">
                    <h4 className="text-primary font-mono font-medium mb-6 tracking-widest text-xs uppercase opacity-80">Ressources</h4>
                    <ul className="space-y-4 text-sm">
                        <li><a href="#" className="hover:text-amber transition-colors flex items-center gap-2"><span className="text-muted text-xs">01</span> Grimoires (Cours)</a></li>
                        <li><a href="#" className="hover:text-amber transition-colors flex items-center gap-2"><span className="text-muted text-xs">02</span> Archives Vidéo</a></li>
                        <li><a href="#" className="hover:text-amber transition-colors flex items-center gap-2"><span className="text-muted text-xs">03</span> Laboratoire (TPs)</a></li>
                        <li><a href="#" className="hover:text-amber transition-colors flex items-center gap-2"><span className="text-muted text-xs">04</span> Assistant Mɛsi</a></li>
                    </ul>
                </div>

                <div className="md:col-span-3">
                    <h4 className="text-primary font-mono font-medium mb-6 tracking-widest text-xs uppercase opacity-80">Codex Légal</h4>
                    <ul className="space-y-4 text-sm">
                        <li><a href="/#ecosystem" className="hover:text-jade transition-colors">Manifeste d'utilisation</a></li>
                        <li><a href="#" className="hover:text-jade transition-colors">Protection des données</a></li>
                        <li><a href="#" className="hover:text-jade transition-colors">Protocole académique</a></li>
                    </ul>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-muted">
                <p>© 2026 Kplɔ́n nǔ. Tous droits réservés.</p>
                <p className="flex items-center gap-1 mt-4 md:mt-0">
                    Système opérationnel <span className="inline-block w-2 h-2 rounded-full bg-jade ml-2 shadow-[0_0_8px_rgba(0,201,167,0.5)]"></span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
