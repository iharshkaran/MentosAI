import { Hexagon, Code, Shield, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="w-full border-t border-zinc-200/80 bg-white/40 backdrop-blur-xl mt-32 pt-16 pb-12">
            <div className="max-w-5xl mx-auto px-6">
                
                {/* Top Row: Brand & Links */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    
                    {/* Col 1: Brand Info */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
                                <Hexagon className="w-4 h-4 text-white fill-white" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-zinc-900">
                                MentosAI
                            </span>
                        </div>
                        <p className="text-zinc-500 text-sm max-w-sm leading-relaxed mb-6">
                            Autonomous multi-format generation engine built for national security intelligence and blockchain threat auditing.
                        </p>
                        <div className="inline-flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-600">
                            <Shield className="w-3.5 h-3.5 text-teal-600" />
                            SIH 2026 — Problem Statement 26154
                        </div>
                    </div>

                    {/* Col 2: Navigation */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">Workspace</h4>
                        <ul className="space-y-3 text-sm text-zinc-600 font-medium">
                            <li><Link to="/dashboard" className="hover:text-zinc-900 transition-colors">Launch Console</Link></li>
                            <li><a href="#features" className="hover:text-zinc-900 transition-colors">Anti-Hallucination</a></li>
                            <li><a href="#pipeline" className="hover:text-zinc-900 transition-colors">Architecture Graph</a></li>
                        </ul>
                    </div>

                    {/* Col 3: Resources / Code */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">Repository</h4>
                        <ul className="space-y-3 text-sm text-zinc-600 font-medium">
                            <li>
                                <a 
                                    href="https://github.com/iharshkaran" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="flex items-center gap-2 hover:text-zinc-900 transition-colors"
                                >
                                    <Code className="w-4 h-4" /> Source Repository
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-zinc-400">
                                <Terminal className="w-4 h-4" /> Node.js
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Row: Copyright & Status */}
                <div className="pt-8 border-t border-zinc-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-medium">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>All Systems Operational</span>
                    </div>
                    <div>
                        © 2026 MentosAI. Built with precision for NTRO.
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;