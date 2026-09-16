import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center text-center pt-32 md:pt-40 pb-12 relative z-10"
        >
            {/* Official SIH & Team Context Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 border border-zinc-200/90 text-zinc-700 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm backdrop-blur-md mb-6">
                <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
                SIH 2026 — Problem ID 26154 (Team KALKI)
            </div>

            {/* Exact Pitch Deck Core USP Headline */}
            <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight text-zinc-900 leading-[1.15] mb-5 max-w-3xl">
                One source content. <br />
                <span className="text-zinc-400 font-light italic">Multiple formats, zero manual effort.</span>
            </h1>

            {/* Accurate Presentation Sub-headline */}
            <p className="text-sm md:text-base text-zinc-500 max-w-xl mx-auto leading-relaxed mb-8">
                Transform unstructured reports, text, or prompts into professional threat advisories, executive summaries, presentations, and video packages in a single click.
            </p>

            {/* Single Centered Action Button */}
            <div className="flex items-center justify-center w-full">
                <Link 
                    to="/dashboard" 
                    className="group flex items-center gap-2 bg-zinc-900 text-white px-8 py-3.5 rounded-full font-medium text-sm transition-all hover:scale-105 shadow-xl shadow-zinc-900/10 active:scale-95"
                >
                    Launch Workspace
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
};

Hero.displayName = "Hero";

export default Hero;