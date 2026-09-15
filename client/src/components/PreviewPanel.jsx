import { useState } from "react";
import { AlertTriangle, Download, CheckCircle2, X } from "lucide-react";

const LABELS = {
  linkedin: "LinkedIn",
  twitter: "X Thread",
  advisory: "Advisory",
  execSummary: "Exec Summary",
  presentation: "Presentation",
  infographic: "Infographic",
  videoPackage: "Video Pkg",
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const PreviewPanel = ({ outputs, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = outputs[activeIndex];

  if (!active) return null;

  return (
    <div className="h-full max-h-[800px] flex flex-col bg-white rounded-3xl border border-zinc-200 shadow-2xl shadow-zinc-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Bar with Tabs & Close Button */}
      <div className="bg-zinc-50/80 backdrop-blur-sm border-b border-zinc-200 px-4 py-3 flex items-center justify-between">
        <div className="flex gap-1 overflow-x-auto custom-scrollbar p-1 bg-zinc-200/50 rounded-xl w-fit">
          {outputs.map((o, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                i === activeIndex 
                  ? "bg-white text-zinc-900 shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100/50"
              }`}
            >
              {LABELS[o.type] || o.type}
            </button>
          ))}
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 rounded-xl transition-all"
            title="Close Preview"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative bg-white">
        {active.status === "failed" ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle size={24} />
            </div>
            <p className="font-medium text-red-600">{active.error || "Failed to generate content."}</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            
            {/* Success Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2 text-teal-600 font-medium text-sm bg-teal-50 px-3 py-1.5 rounded-full">
                <CheckCircle2 size={16} /> Generated Successfully
              </div>
              <a
                href={`${API_BASE}/api/download/${active.exportedFilePath}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 px-4 py-2 rounded-full transition-colors"
              >
                <Download size={16} /> Download File
              </a>
            </div>

            {/* Validation Warnings */}
            {active.validation && !active.validation.passed && (
              <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 mb-6 shadow-sm">
                <div className="flex items-center gap-2 font-semibold mb-2 text-amber-800">
                  <AlertTriangle size={18} /> Review Recommended
                </div>
                <ul className="list-disc list-inside text-sm text-amber-700/80 space-y-1">
                  {active.validation.issues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Content Display */}
            {active.type === "infographic" ? (
              <img
                src={`${API_BASE}/outputs/${active.exportedFilePath}`}
                alt="Generated infographic"
                className="w-full rounded-2xl border border-zinc-200 shadow-md"
              />
            ) : (
              <div className="prose prose-zinc max-w-none text-[15px] leading-relaxed text-zinc-700 whitespace-pre-wrap font-serif">
                {active.rawContent}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;