import { motion } from "motion/react";
import { ShieldCheck, Zap, Database, Lock, Terminal, Cpu } from "lucide-react";

const FeaturesGrid = () => {
    const features = [
        {
            icon: ShieldCheck,
            title: "Anti-Hallucination Guardrails",
            description: "Cross-references extracted indicators against secure contextual ground truth to guarantee zero-hallucination accuracy scores.",
            tag: "Security"
        },
        {
            icon: Zap,
            title: "Parallel Multi-Format Execution",
            description: "Triggers asynchronous processing to simultaneously generate Markdown advisories, PDFs, and PNG infographics in seconds.",
            tag: "Performance"
        },
        {
            icon: Database,
            title: "Context Intelligence Extraction",
            description: "Instantly parses CVE IDs, threat actor hashes, and risk severities from raw threat intelligence feeds or smart contracts.",
            tag: "Parsing"
        },
        {
            icon: Lock,
            title: "Enterprise-Grade Security",
            description: "Secured with Clerk authentication, role-based access control, and encrypted local storage state persistence.",
            tag: "Compliance"
        }
    ];

    return (
        <section className="w-full mt-28 mb-16 relative">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 bg-white/60 border border-zinc-200/80 px-3 py-1 rounded-full">
                    Engineered for Scale
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-zinc-900 mt-4 mb-4">
                    Built for high-stakes intelligence.
                </h2>
                <p className="text-zinc-500 text-base leading-relaxed">
                    Designed from the ground up to support national security analysts and blockchain security auditors with zero friction.
                </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {features.map((feat, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className="bg-white/60 hover:bg-white/90 border border-zinc-200/80 p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-all duration-300 group flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                                    <feat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">
                                    {feat.tag}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                                {feat.title}
                            </h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                {feat.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

FeaturesGrid.displayName = "FeaturesGrid";

export default FeaturesGrid;