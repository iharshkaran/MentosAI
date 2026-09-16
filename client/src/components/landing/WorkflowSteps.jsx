import { motion } from "motion/react";
import { UploadCloud, Sliders, DownloadCloud } from "lucide-react";

const WorkflowSteps = () => {
    const steps = [
        {
            step: "01",
            icon: UploadCloud,
            title: "Ingest Any Source",
            description: "Upload unstructured PDF threat logs, raw text files, or paste raw smart contract (.sol) snippets directly into the console."
        },
        {
            step: "02",
            icon: Sliders,
            title: "Configure & Select Formats",
            description: "Choose your desired outputs—Threat Advisories, Code Audits, or Video Storyboards—with customizable tone and depth."
        },
        {
            step: "03",
            icon: DownloadCloud,
            title: "Instant Multi-Export",
            description: "Our backend runs parallel generation models backed by anti-hallucination scoring, delivering export-ready assets instantly."
        }
    ];

    return (
        <section className="w-full mt-32 mb-16 relative">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 bg-white/60 border border-zinc-200/80 px-3 py-1 rounded-full">
                    Seamless UX
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-zinc-900 mt-4 mb-4">
                    Three steps to total clarity.
                </h2>
                <p className="text-zinc-500 text-base leading-relaxed">
                    Zero complex prompt engineering. Just raw source material converted into structured professional output.
                </p>
            </div>

            {/* 3 Columns Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {steps.map((item, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.15, duration: 0.5 }}
                        className="bg-white/50 hover:bg-white/80 border border-zinc-200/80 p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all duration-300 relative group flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 text-zinc-900 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                                    <item.icon className="w-6 h-6 text-zinc-800" />
                                </div>
                                <span className="text-2xl font-serif font-light text-zinc-300 group-hover:text-zinc-900 transition-colors">
                                    {item.step}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                                {item.title}
                            </h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

WorkflowSteps.displayName = "WorkflowSteps";

export default WorkflowSteps;