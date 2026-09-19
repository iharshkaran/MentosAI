import { AlertTriangle, Download, CheckCircle2, XCircle } from "lucide-react";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const LABELS = {
    linkedin: "LinkedIn Post",
    twitter: "X (Twitter) Thread",
    advisory: "Advisory / Notice",
    execSummary: "Executive Summary",
    presentation: "Presentation",
    infographic: "Infographic",
    videoPackage: "Video Package",
    threatIntel: "Threat Intelligence Advisory",
    contractAudit: "Smart Contract Audit",
};

const ResultCard = ({ output }) => {
    const isFailed = output.status === "failed";
    const hasWarning = !isFailed && output.validation && !output.validation.passed;

    return (
        <div className="group border border-zinc-200 rounded-2xl p-5 bg-white hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-300 relative overflow-hidden">
            {/* Color Coded Status Line on the left */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isFailed ? 'bg-red-500' : hasWarning ? 'bg-amber-400' : 'bg-teal-500'}`} />

            <div className="flex items-center justify-between mb-4 pl-2">
                <h3 className="font-semibold text-zinc-900 tracking-tight">{LABELS[output.type] || output.type}</h3>
                {isFailed ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                        <XCircle size={14} /> Failed
                    </span>
                ) : (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-100">
                        <CheckCircle2 size={14} /> Success
                    </span>
                )}
            </div>

            <div className="pl-2">
                {isFailed ? (
                    <p className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100/50">{output.error}</p>
                ) : (
                    <>
                        {hasWarning && (
                            <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 mb-4 text-sm text-amber-800">
                                <div className="flex items-center gap-2 font-semibold mb-2">
                                    <AlertTriangle size={16} className="text-amber-600" /> Review Recommended
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-amber-700/80 ml-1">
                                    {output.validation.issues.map((issue, i) => (
                                        <li key={i}>{issue}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {output.type === "infographic" ? (
                            <div className="rounded-xl overflow-hidden border border-zinc-200 mb-4 bg-zinc-50 relative">
                                <img
                                    src={`${API_BASE}/outputs/${output.exportedFilePath}`}
                                    alt="Generated infographic"
                                    className="w-full object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                        ) : (
                            <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-100 mb-4 max-h-[250px] overflow-y-auto custom-scrollbar">
                                <p className="text-[15px] text-zinc-700 whitespace-pre-wrap leading-relaxed font-serif">
                                    {output.rawContent}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end mt-2 pt-2 border-t border-zinc-100">
                            <a href={`${API_BASE}/api/download/${output.exportedFilePath}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <Download size={16} /> Download
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResultCard;