import { useState, useEffect } from "react";
import { AlertTriangle, Download, Clock, ShieldCheck, X, Copy, Check, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import SlidePreview from "./SlidePreview";
import StoryboardPreview from "./StoryboardPreview";
import StatsModal from "./StatsModal";

const LABELS = {
    linkedin: "LinkedIn Post",
    twitter: "X Thread",
    advisory: "Threat Advisory",
    summary: "Exec Summary",
    presentation: "Presentation",
    infographic: "Infographic",
    video: "Video Package"
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const PreviewPanel = ({ outputs, generationTimeMs, onClose }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [showStats, setShowStats] = useState(false);

    // Jab tab change ho, toh 'copied' state ko reset kar do
    useEffect(() => {
        setCopied(false);
    }, [activeIndex]);

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

            {/* Modal Render */}
            {showStats && (
                <StatsModal
                    outputs={outputs}
                    generationTimeMs={generationTimeMs}
                    onClose={() => setShowStats(false)}
                />
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
                                <SlidePreview rawContent={active.rawContent} />
                            ) : active.type === "videoPackage" ? (
                                <StoryboardPreview rawContent={active.rawContent} />
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