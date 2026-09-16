import { motion } from "motion/react";
import { FileText, Video, LayoutTemplate, ShieldAlert, Cpu } from "lucide-react";

const PipelineVisual = () => {
    return (
        <motion.div
            id="pipeline"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full mt-24 relative max-w-5xl mx-auto px-4 sm:px-0"
        >
            <div className="relative w-full rounded-[2.5rem] bg-white/40 border border-white/60 p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl overflow-hidden">

                {/* Soft background gradient blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-orange-100/60 via-blue-50/60 to-zinc-100/60 blur-3xl -z-10 rounded-full" />

                {/* Inline style for SVG flowing data animation */}
                <style>
                    {`
                        .flow-line {
                            stroke-dasharray: 6 6;
                            animation: flow-animation 1s linear infinite;
                        }
                        @keyframes flow-animation {
                            from { stroke-dashoffset: 12; }
                            to { stroke-dashoffset: 0; }
                        }
                    `}
                </style>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 relative z-10">

                    {/* 1. Input Stage (Left) */}
                    <div className="mt-10 flex flex-col items-center gap-4 w-32 shrink-0 z-20">
                        <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-20 h-20 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center relative overflow-hidden"
                        >
                            {/* Scanning effect */}
                            <motion.div
                                animate={{ top: ["-10%", "110%"] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-[1px] bg-zinc-900/10 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                            />
                            <FileText className="w-8 h-8 text-zinc-800" strokeWidth={1.5} />
                        </motion.div>
                        <span className="text-sm font-medium text-zinc-500 bg-white/50 px-3 py-1 rounded-full backdrop-blur-md">Raw Intel</span>
                    </div>

                    {/* 2. Processing Pipeline (Center SVG + Node) */}
                    <div className="flex-1 w-full h-24 md:h-[220px] flex items-center justify-center relative md:mx-2">

                        {/* Desktop SVG Connecting Lines */}
                        <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }} preserveAspectRatio="none" viewBox="0 0 100 100">
                            {/* Solid Base Lines - Y values perfectly calibrated to 15, 50, 85 */}
                            <path d="M -10 50 L 50 50" stroke="#E4E4E7" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                            <path d="M 50 50 C 75 50, 75 15, 105 15" stroke="#E4E4E7" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                            <path d="M 50 50 L 105 50" stroke="#E4E4E7" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                            <path d="M 50 50 C 75 50, 75 85, 105 85" stroke="#E4E4E7" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />

                            {/* Animated Flowing Lines (Darker Gray) */}
                            <path d="M -10 50 L 50 50" className="flow-line" stroke="#A1A1AA" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                            <path d="M 50 50 C 75 50, 75 15, 105 15" className="flow-line" stroke="#A1A1AA" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                            <path d="M 50 50 L 105 50" className="flow-line" stroke="#A1A1AA" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                            <path d="M 50 50 C 75 50, 75 85, 105 85" className="flow-line" stroke="#A1A1AA" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                        </svg>

                        {/* Mobile Simple Vertical Line */}
                        <div className="md:hidden absolute top-0 bottom-0 w-[2px] bg-zinc-200 left-1/2 -translate-x-1/2">
                            <div className="w-full h-1/2 bg-gradient-to-b from-zinc-200 to-zinc-400 animate-pulse"></div>
                        </div>

                        {/* Central AI Engine Node */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-zinc-900 border-4 border-white shadow-lg flex items-center justify-center z-20 group cursor-default">
                            {/* Inner rotating ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-1 rounded-full border border-dashed border-zinc-500/50"
                            />
                            <Cpu className="w-5 h-5 text-white relative z-10" />
                            <div className="absolute inset-0 rounded-full bg-zinc-900 blur-md opacity-20 transition-opacity"></div>
                        </div>
                    </div>

                    {/* 3. Output Stage (Right - 3 Formats) */}
                    <div className="flex flex-col shrink-0 w-full md:w-56 z-20 h-[220px] justify-between">
                        {[
                            { icon: ShieldAlert, label: "Threat Advisory" },
                            { icon: LayoutTemplate, label: "Infographic" },
                            { icon: Video, label: "Video Package" }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + (idx * 0.15), duration: 0.5, type: "spring", stiffness: 100 }}
                                // Removed hover:-translate-y-1 so the dots stay perfectly locked to the SVG lines
                                className="bg-white border border-zinc-200 px-5 py-4 rounded-2xl shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] flex items-center gap-4 transition-all hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] relative group cursor-default"
                            >
                                {/* Connection dot perfectly aligned to the expanded SVG lines */}
                                <div className="hidden md:block absolute -left-[6.5px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-zinc-300 group-hover:border-zinc-500 transition-colors z-30" />

                                <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-100">
                                    <item.icon className="w-[18px] h-[18px] text-zinc-600" />
                                </div>
                                <span className="text-[14px] font-semibold text-zinc-800">{item.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PipelineVisual;