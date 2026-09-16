import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, ShieldAlert, FileText, CheckCircle2, Cpu } from "lucide-react";

const LivePlayground = () => {
    const [activeTab, setActiveTab] = useState("threatIntel");

    const outputs = {
        threatIntel: {
            title: "Threat Advisory Matrix",
            badge: "Critical Severity",
            content: `[CVE-2026-8891] Remote Code Execution Vulnerability Detected\n- Target Protocol: EVM Bridge Router v2.4\n- Risk Score: 9.8 / 10.0 (Critical)\n- Mitigation: Immediate patch deployment required via secure multi-sig enclave.`
        },
        contractAudit: {
            title: "Smart Contract Security Audit",
            badge: "Reentrancy Guard Missing",
            content: `contract VaultAudit {\n    // Warning: External call before state update in withdraw()\n    // Status: Vulnerable to cross-function reentrancy.\n    // Recommended Fix: Implement OpenZeppelin ReentrancyGuard modifier.\n}`
        },
        infographic: {
            title: "Executive Summary Flow",
            badge: "Generated Artifacts",
            content: `✔ Ingestion Phase: Complete (768-dim embeddings mapped)\n✔ Anti-Hallucination Guardrail: Verified (0.94 Accuracy Score)\n✔ Export Status: Ready for PDF & PNG Dark-Theme Render.`
        }
    };

    return (
        <section className="w-full mt-28 mb-16 relative">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 bg-white/60 border border-zinc-200/80 px-3 py-1 rounded-full">
                    Interactive Preview
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-zinc-900 mt-4 mb-4">
                    See the engine in action.
                </h2>
                <p className="text-zinc-500 text-base leading-relaxed">
                    Click through the output types below to experience how raw unstructured inputs convert into structured intelligence.
                </p>
            </div>

            {/* Playground Box */}
            <div className="max-w-4xl mx-auto bg-white/80 border border-zinc-200/90 rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl">
                
                {/* Switcher Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-zinc-100/80 p-1.5 rounded-2xl border border-zinc-200/60">
                    {[
                        { id: "threatIntel", label: "Threat Intel Advisory" },
                        { id: "contractAudit", label: "Smart Contract Audit" },
                        { id: "infographic", label: "System Metrics" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                                activeTab === tab.id
                                    ? "bg-zinc-900 text-white shadow-md"
                                    : "text-zinc-500 hover:text-zinc-900 hover:bg-white/50"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Simulated Terminal Screen */}
                <div className="bg-[#09090b] text-zinc-100 rounded-2xl p-6 font-mono text-xs md:text-sm shadow-inner overflow-hidden relative border border-zinc-800">
                    {/* Top macOS-style Dots */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80 text-zinc-400">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            <span className="ml-2 text-xs text-zinc-500 font-sans">mentos-engine-v2.5.js</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {outputs[activeTab].badge}
                        </div>
                    </div>

                    {/* Content Area with Animation */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                            className="min-h-[140px] flex flex-col justify-between"
                        >
                            <div>
                                <p className="text-zinc-400 text-xs mb-3 font-bold uppercase tracking-wider">// {outputs[activeTab].title}</p>
                                <pre className="text-zinc-200 whitespace-pre-wrap font-mono leading-relaxed text-xs md:text-sm">
                                    {outputs[activeTab].content}
                                </pre>
                            </div>
                            <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                                <span className="flex items-center gap-1.5">
                                    <Cpu className="w-3.5 h-3.5 text-teal-400" /> Powered by LangChain + Gemini 2.5 Flash
                                </span>
                                <span className="text-teal-400">Status: Secure Pipeline</span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
};

LivePlayground.displayName = "LivePlayground";

export default LivePlayground;