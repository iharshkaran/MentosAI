import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, X, File } from "lucide-react";

const SOURCE_TYPE_MAP = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "image/jpeg": "image",
    "image/png": "image",
};

const UploadForm = ({ onFileSelect, sourceType, setSourceType, rawText, setRawText }) => {
    const [file, setFile] = useState(null);

    const onDrop = useCallback(
        (acceptedFiles) => {
            const selected = acceptedFiles[0];
            if (!selected) return;
            setFile(selected);
            const detectedType = SOURCE_TYPE_MAP[selected.type] || "pdf";
            setSourceType(detectedType);
            onFileSelect(selected);
        },
        [onFileSelect, setSourceType]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });

    const clearFile = () => {
        setFile(null);
        onFileSelect(null);
    };

    return (
        <div className="space-y-5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                Source Content
            </label>

            {!file ? (
                <div
                    {...getRootProps()}
                    className={`relative group border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                        isDragActive
                            ? "border-teal-500 bg-teal-50/50 shadow-inner"
                            : "border-zinc-200 bg-white hover:border-teal-400/60 hover:bg-teal-50/10 hover:shadow-md"
                    }`}
                >
                    <input {...getInputProps()} />
                    <div className={`mx-auto w-14 h-14 mb-4 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isDragActive ? "bg-teal-100 text-teal-600" : "bg-zinc-50 text-zinc-400 group-hover:bg-teal-50 group-hover:text-teal-500"
                    }`}>
                        <UploadCloud size={28} />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                        Click to upload or drag and drop
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">
                        PDF, DOCX, or Images (max 10MB)
                    </p>
                </div>
            ) : (
                <div className="flex items-center justify-between border border-zinc-200 rounded-2xl p-4 bg-white shadow-sm ring-1 ring-black/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
                            <File size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-zinc-900 truncate max-w-[200px] sm:max-w-[300px]">
                                {file.name}
                            </p>
                            <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={clearFile}
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-100"
                        title="Remove file"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-zinc-200"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-zinc-400 font-semibold uppercase tracking-widest">
                    Or paste text
                </span>
                <div className="flex-grow border-t border-zinc-200"></div>
            </div>

            <textarea
                value={rawText}
                onChange={(e) => {
                    setRawText(e.target.value);
                    if (e.target.value) setSourceType("text");
                }}
                placeholder="Paste your content directly here..."
                rows={5}
                className="w-full bg-white border border-zinc-200 rounded-2xl p-4 text-[15px] leading-relaxed text-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all shadow-sm resize-none custom-scrollbar placeholder:text-zinc-400"
            />
        </div>
    );
};

export default UploadForm;