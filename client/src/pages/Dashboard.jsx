import { useState } from "react";
import UploadForm from "../components/UploadForm";
import OutputSelector from "../components/OutputSelector";
import ConfigPanel from "../components/ConfigPanel";
import ResultCard from "../components/ResultCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGenerate } from "../hooks/useGenerate";

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [sourceType, setSourceType] = useState("pdf");
    const [rawText, setRawText] = useState("");
    const [outputTypes, setOutputTypes] = useState([]);
    const [config, setConfig] = useState({
        tone: "professional",
        audience: "",
        language: "en",
        detailLevel: "standard",
    });

    const { generate, loading, result, error } = useGenerate();

    const handleSubmit = () => {
        if (outputTypes.length === 0) {
            alert("Select at least one output type");
            return;
        }
        generate({ file, sourceType, rawText, outputTypes, config });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">MentosAI — Content Transformation</h1>

            <div className="bg-white rounded-xl shadow p-6 space-y-6">
                <UploadForm
                    onFileSelect={setFile}
                    sourceType={sourceType}
                    setSourceType={setSourceType}
                    rawText={rawText}
                    setRawText={setRawText}
                />
                <OutputSelector selected={outputTypes} setSelected={setOutputTypes} />
                <ConfigPanel config={config} setConfig={setConfig} />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Generating..." : "Generate"}
                </button>
            </div>

            {loading && <LoadingSpinner />}

            {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.outputs.map((output, i) => (
                        <ResultCard key={i} output={output} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;