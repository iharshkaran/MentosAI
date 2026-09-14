import { AlertTriangle, Download, CheckCircle2 } from "lucide-react";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const LABELS = {
    linkedin: "LinkedIn Post",
    twitter: "X (Twitter) Thread",
    advisory: "Advisory / Notice",
    execSummary: "Executive Summary",
    presentation: "Presentation",
    infographic: "Infographic",
    videoPackage: "Video Package",
};

const ResultCard = ({ output }) => {
    const isFailed = output.status === "failed";
    const hasWarning = !isFailed && output.validation && !output.validation.passed;

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-800">{LABELS[output.type] || output.type}</h3>
                {isFailed ? (
                    <span className="text-xs text-red-500">Failed</span>
                ) : (
                    <CheckCircle2 size={16} className="text-green-500" />
                )}
            </div>

            {isFailed ? (
                <p className="text-sm text-red-500">{output.error}</p>
            ) : (
                <>
                    {hasWarning && (
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-2 mb-2 text-xs text-amber-700">
                            <div className="flex items-center gap-1 font-medium mb-1">
                                <AlertTriangle size={14} /> Review recommended
                            </div>
                            <ul className="list-disc list-inside">
                                {output.validation.issues.map((issue, i) => (
                                    <li key={i}>{issue}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {output.type === "infographic" ? (
                        <img
                            src={`${API_BASE}/outputs/${output.exportedFilePath}`}
                            alt="Generated infographic"
                            className="w-full rounded-lg border mb-2"
                        />
                    ) : (
                        <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-6">
                            {output.rawContent}
                        </p>
                    )}


                    <a href={`${API_BASE}/api/download/${output.exportedFilePath}`}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 mt-2 hover:underline"
                    >
                        <Download size={14} /> Download
                    </a>
                </>
            )
            }
        </div >
    );
};

export default ResultCard;