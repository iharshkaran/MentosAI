import { lazy, Suspense, useState } from "react";
import { AlertTriangle, Download, Clock, ShieldCheck, X, Copy, Check, FileText, Fingerprint, Link2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
const SlidePreview = lazy(() => import("./SlidePreview"));
const StoryboardPreview = lazy(() => import("./StoryboardPreview"));
const ContractAuditPreview = lazy(() => import("./ContractAuditPreview"));
const StatsModal = lazy(() => import("./StatsModal"));
import { verifyLedgerJob } from "../services/api";

const LABELS = {
    linkedin: "LinkedIn Post",
    twitter: "X Thread",
    advisory: "Threat Advisory",
    execSummary: "Exec Summary",
    summary: "Exec Summary",
    presentation: "Presentation",
    infographic: "Infographic",
    videoPackage: "Video Package",
    video: "Video Package",
    threatIntel: "Threat Intel",
    contractAudit: "Contract Audit",
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const severityStyles = {
    Critical: "bg-red-100 text-red-700 border-red-200",
    High: "bg-orange-100 text-orange-700 border-orange-200",
    Medium: "bg-amber-100 text-amber-800 border-amber-200",
    Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "N/A": "bg-zinc-100 text-zinc-600 border-zinc-200",
};

const domainLabel = (domain) => {
    if (!domain) return "General";
    if (domain.toLowerCase().includes("cyber")) return "Cybersecurity";
    if (domain.toLowerCase().includes("block")) return "Blockchain";
    return domain.charAt(0).toUpperCase() + domain.slice(1);
};

const PreviewPanel = ({ outputs, generationTimeMs, onClose, context, blockchainProof, jobId, getToken }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [verifyState, setVerifyState] = useState(null);
    const [verifying, setVerifying] = useState(false);

    if (!outputs || outputs.length === 0) return null;

    const active = outputs[activeIndex];
    const successOutputs = outputs.filter((o) => o.status === "success");
    const passedValidation = successOutputs.filter((o) => o.validation?.passed).length;
    const failedCount = outputs.length - successOutputs.length;
    const timeLabel = generationTimeMs ? `${(generationTimeMs / 1000).toFixed(1)}s` : null;

    // Copy function
    const handleCopy = () => {
        if (active.rawContent) {
            navigator.clipboard.writeText(active.rawContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleVerifySeal = async () => {
        if (!jobId) return;
        setVerifying(true);
        try {
            const data = await verifyLedgerJob(jobId, getToken);
            setVerifyState(data);
        } catch (err) {
            setVerifyState({ verified: false, error: err.response?.data?.error || "Verification failed" });
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm relative">

            {/* Top Bar: Tabs & Close Button */}
            <div className="flex justify-between items-center pr-2 border-b border-zinc-100 bg-zinc-50/50">
                <div className="flex gap-1.5 p-2 overflow-x-auto custom-scrollbar">
                    {outputs.map((o, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            type="button"
                            className={`px-4 py-1.5 rounded-lg text-sm whitespace-nowrap font-medium transition-all duration-200 ${i === activeIndex
                                ? "bg-zinc-900 text-white shadow-md"
                                : "text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-900"
                                }`}
                        >
                            {LABELS[o.type] || o.type}
                        </button>
                    ))}
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-700 transition-colors">
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-4 px-5 py-3 bg-white border-b border-zinc-100 text-xs font-medium text-zinc-500">

                {/* Generation Time */}
                {timeLabel && (
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-zinc-400" /> {timeLabel}
                    </span>
                )}

                {/* Interactive Stats Badge / Button */}
                <button
                    onClick={() => setShowStats(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm active:scale-95 cursor-pointer"
                    type="button"
                >
                    <ShieldCheck size={14} className={passedValidation === successOutputs.length ? "text-emerald-500" : "text-amber-500"} />
                    {passedValidation}/{successOutputs.length} Validated
                </button>

                {/* Failed Count Pill */}
                {failedCount > 0 && (
                    <span className="flex items-center gap-1.5 text-red-500 bg-red-50 px-2.5 py-1 rounded-md border border-red-100 shadow-sm">
                        <AlertTriangle size={12} /> {failedCount} failed
                    </span>
                )}
            </div>

            {(context || blockchainProof) && (
                <div className="px-5 py-3 border-b border-zinc-100 bg-zinc-50/70 space-y-3">
                    {context && (
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                                Cyber & Blockchain Intelligence
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-800 border border-teal-100">
                                    Domain: {domainLabel(context.domain)}
                                </span>
                                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${severityStyles[context.riskSeverity] || severityStyles["N/A"]}`}>
                                    Risk: {context.riskSeverity || "N/A"}
                                </span>
                                {(context.cveIds || []).slice(0, 6).map((cve) => (
                                    <span key={cve} className="px-2 py-1 rounded-md text-[11px] font-mono bg-white border border-zinc-200 text-zinc-700">
                                        {cve}
                                    </span>
                                ))}
                                {(context.entities || []).slice(0, 8).map((entity) => (
                                    <span key={entity} className="px-2 py-1 rounded-full text-[11px] bg-zinc-100 text-zinc-600 border border-zinc-200">
                                        {entity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {blockchainProof && (
                        <button
                            type="button"
                            onClick={handleVerifySeal}
                            className="w-full text-left rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2.5 hover:bg-emerald-50 transition-colors"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Fingerprint size={16} className="text-emerald-600 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                                            Cryptographic Blockchain Seal
                                        </p>
                                        <p className="text-xs text-zinc-700 truncate font-mono">
                                            Block #{blockchainProof.blockIndex} · {blockchainProof.blockHash}
                                        </p>
                                    </div>
                                </div>
                                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-emerald-600 text-white">
                                    <ShieldCheck size={12} />
                                    {verifying
                                        ? "Verifying…"
                                        : verifyState?.verified === false
                                            ? "Invalid"
                                            : "Tamper-Proof Verified"}
                                </span>
                            </div>
                            {verifyState && (
                                <p className={`mt-2 text-[11px] flex items-center gap-1 ${verifyState.verified ? "text-emerald-700" : "text-red-600"}`}>
                                    <Link2 size={12} />
                                    {verifyState.verified
                                        ? verifyState.chainIntegrity || "Chain integrity confirmed"
                                        : verifyState.error || "Hash mismatch"}
                                </p>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Modal Render */}
            {showStats && (
                <Suspense fallback={null}><StatsModal
                    outputs={outputs}
                    generationTimeMs={generationTimeMs}
                    onClose={() => setShowStats(false)}
                /></Suspense>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col bg-[#F4F3EF]/30 p-4 md:p-6">
                {active.status === "failed" ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-2">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-zinc-900 font-medium">Generation Failed</h3>
                        <p className="text-red-500 text-sm max-w-sm bg-red-50 p-3 rounded-lg border border-red-100 leading-relaxed">
                            {active.error || "An unknown error occurred while generating this format."}
                        </p>
                    </div>
                ) : (
                    <div className="h-full flex flex-col max-w-4xl mx-auto w-full">

                        {/* Preview Toolbar (Actions) */}
                        <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                                <FileText size={16} className="text-zinc-500" />
                                {LABELS[active.type] || "Document"} Preview
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Copy Button */}
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-95"
                                >
                                    {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                                    {copied ? "Copied!" : "Copy Text"}
                                </button>

                                {/* Download Button */}
                                {active.exportedFilePath && (

                                    <a href={`${API_BASE}/api/download/${active.exportedFilePath}`}
                                        className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-95"
                                    >
                                        <Download size={15} />
                                        Download File
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Rich Text Render Area (Document feel) */}
                        <div className="flex-1 bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm overflow-y-auto custom-scrollbar">
                            {active.type === "infographic" ? (
                                <img
                                    src={`${API_BASE}/outputs/${active.exportedFilePath}`}
                                    alt="Generated infographic"
                                    className="w-full rounded-xl"
                                />
                            ) : active.type === "presentation" ? (
                                <Suspense fallback={<p>Loading presentation preview…</p>}><SlidePreview rawContent={active.rawContent} /></Suspense>
                            ) : active.type === "videoPackage" ? (
                                <Suspense fallback={<p>Loading video preview…</p>}><StoryboardPreview rawContent={active.rawContent} /></Suspense>
                            ) : active.type === "contractAudit" ? (
                                <Suspense fallback={<p>Loading audit preview…</p>}><ContractAuditPreview rawContent={active.rawContent} /></Suspense>
                            ) : (
                                <div className="prose-content text-sm md:text-[15px] text-zinc-700 leading-relaxed">
                                    <ReactMarkdown>{active.rawContent || "No content generated. Check the download file if available."}</ReactMarkdown>
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviewPanel;
