import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, X } from "lucide-react";

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
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Source content</label>

            {!file ? (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                        }`}
                >
                    <input {...getInputProps()} />
                    <UploadCloud className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-sm text-gray-500">
                        Drag & drop a file, or click to browse (PDF, DOCX, image)
                    </p>
                </div>
            ) : (
                <div className="flex items-center justify-between border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <FileText size={18} className="text-gray-500" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                    <button onClick={clearFile} className="text-gray-400 hover:text-red-500">
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="text-center text-xs text-gray-400">— or —</div>

            <textarea
                value={rawText}
                onChange={(e) => {
                    setRawText(e.target.value);
                    if (e.target.value) setSourceType("text");
                }}
                placeholder="Paste text content directly..."
                rows={4}
                className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>
    );
};

export default UploadForm;