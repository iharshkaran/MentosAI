import { X, CheckCircle2, AlertTriangle, XCircle, Clock, BarChart3, Zap, Activity, ShieldCheck } from "lucide-react";

const LABELS = {
    linkedin: "LinkedIn Post",
    twitter: "X Thread",
    advisory: "Threat Advisory",
    execSummary: "Exec Summary",
    presentation: "Presentation",
    infographic: "Infographic",
    videoPackage: "Video Package",
    threatIntel: "Threat Intel",
    contractAudit: "Contract Audit",
};

const StatsModal = ({ outputs, generationTimeMs, onClose }) => {
    const passed = outputs.filter((o) => o.status === "success" && o.validation?.passed);
    const flagged = outputs.filter((o) => o.status === "success" && o.validation && !o.validation.passed);
    const failed = outputs.filter((o) => o.status === "failed");

    const total = outputs.length || 1; // Prevent division by zero
    const pct = (n) => ((n.length / total) * 100).toFixed(0);
    const cleanRate = pct(passed);

    // Average time per artifact
    const avgTime = generationTimeMs ? (generationTimeMs / total / 1000).toFixed(1) : 0;

    return (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 animation-fade-in">
            <div className="bg-[#F4F3EF] rounded-[2rem] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-zinc-200 overflow-hidden relative">

                {/* Background Texture */}
                <div className="absolute inset-0 pointer-events-none opacity-40 z-0" style={{
                    backgroundImage: `linear-gradient(to right, #d4d4d8 1px, transparent 1px), linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)`,
                    backgroundSize: '2.5rem 2.5rem',
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)'
                }} />

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-zinc-200/80 bg-white/60 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-md">
                            <BarChart3 size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif font-medium text-zinc-900 tracking-tight">Intelligence Report</h2>
                            <p className="text-xs text-zinc-500 font-medium">Generation analytics & quality metrics</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-200/50 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Dashboard Metrics (KPI Cards) */}
                <div className="relative z-10 px-8 pt-6 pb-2 grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm flex flex-col justify-between">
                        <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><Activity size={14} className="text-blue-500" /> Total Artifacts</span>
                        <div className="text-3xl font-serif text-zinc-900 mt-2">{outputs.length}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm flex flex-col justify-between">
                        <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Clean Rate</span>
                        <div className="text-3xl font-serif text-zinc-900 mt-2">{cleanRate}%</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm flex flex-col justify-between">
                        <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><Zap size={14} className="text-amber-500" /> Avg Time</span>
                        <div className="text-3xl font-serif text-zinc-900 mt-2 flex items-baseline gap-1">{avgTime}<span className="text-sm font-sans text-zinc-400 font-medium">sec</span></div>
                    </div>
                </div>

                {/* Solid Visual Graph (Thick Stacked Bar) */}
                <div className="relative z-10 px-8 py-5">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-semibold text-zinc-800">Quality Distribution</span>
                        <span className="text-xs font-medium text-zinc-500">{passed.length} clean • {flagged.length} flagged • {failed.length} failed</span>
                    </div>
                    {/* The Chart */}
                    <div className="w-full h-8 flex rounded-xl overflow-hidden shadow-inner bg-zinc-200 border border-zinc-300/50">
                        {passed.length > 0 && (
                            <div style={{ width: `${pct(passed)}%` }} className="bg-emerald-500 relative group transition-all duration-500 ease-out hover:brightness-110 flex items-center justify-center">
                                {pct(passed) > 10 && <span className="text-[10px] font-bold text-emerald-950">{pct(passed)}%</span>}
                            </div>
                        )}
                        {flagged.length > 0 && (
                            <div style={{ width: `${pct(flagged)}%` }} className="bg-amber-400 relative group transition-all duration-500 ease-out hover:brightness-110 flex items-center justify-center border-l border-zinc-900/10">
                                {pct(flagged) > 10 && <span className="text-[10px] font-bold text-amber-950">{pct(flagged)}%</span>}
                            </div>
                        )}
                        {failed.length > 0 && (
                            <div style={{ width: `${pct(failed)}%` }} className="bg-red-500 relative group transition-all duration-500 ease-out hover:brightness-110 flex items-center justify-center border-l border-zinc-900/10">
                                {pct(failed) > 10 && <span className="text-[10px] font-bold text-red-950">{pct(failed)}%</span>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Per-output Detailed Breakdown */}
                <div className="relative z-10 flex-1 overflow-y-auto px-8 pb-8 space-y-3 custom-scrollbar bg-gradient-to-b from-transparent to-white/50">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 sticky top-0 bg-[#F4F3EF]/90 backdrop-blur-md py-2 z-20">Detailed Logs</h3>

                    {outputs.map((o, i) => {
                        const label = LABELS[o.type] || o.type;

                        // Failed State
                        if (o.status === "failed") {
                            return (
                                <div key={i} className="flex gap-4 bg-white border border-red-200 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
                                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                        <XCircle size={18} className="text-red-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-zinc-900">{label}</p>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-0.5 rounded-md">Failed</span>
                                        </div>
                                        <p className="text-xs font-medium text-zinc-500 mt-1 bg-zinc-50 p-2 rounded-lg border border-zinc-100">{o.error}</p>
                                    </div>
                                </div>
                            );
                        }

                        // Flagged State
                        if (o.validation && !o.validation.passed) {
                            return (
                                <div key={i} className="flex gap-4 bg-white border border-amber-200 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400"></div>
                                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                                        <AlertTriangle size={18} className="text-amber-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-zinc-900">{label}</p>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Flagged</span>
                                        </div>
                                        <ul className="mt-2 space-y-1.5">
                                            {o.validation.issues.map((issue, j) => (
                                                <li key={j} className="text-xs font-medium text-zinc-600 bg-zinc-50 p-1.5 rounded-md border border-zinc-100 flex items-start gap-2">
                                                    <span className="text-amber-500 mt-0.5">•</span> {issue}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        }

                        // Success / Clean State
                        return (
                            <div key={i} className="flex gap-4 bg-white border border-emerald-200/60 rounded-2xl p-4 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 opacity-80"></div>
                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                </div>
                                <div className="flex-1 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-900">{label}</p>
                                        <p className="text-xs font-medium text-zinc-500 mt-0.5">Zero hallucinations detected</p>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100/50">Clean</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StatsModal;