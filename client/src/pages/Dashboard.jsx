import { useState, useEffect } from "react";
import { useAuth, useReverification } from "@clerk/clerk-react";
import Sidebar from "../components/Sidebar";
import ConsoleInput from "../components/ConsoleInput";
import OutputChips from "../components/OutputChips";
import ConfigPanel from "../components/ConfigPanel";
import PreviewPanel from "../components/PreviewPanel";
import QuickPrompts from "../components/QuickPrompts";
import PoweredByRow from "../components/PoweredByRow";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGenerate } from "../hooks/useGenerate";
import { getJobById } from "../services/api";


const Dashboard = () => {
    const [elapsed, setElapsed] = useState(0);
    const [file, setFile] = useState(null);
    const [text, setText] = useState("");
    const [outputTypes, setOutputTypes] = useState([]);
    const [config, setConfig] = useState({
        tone: "professional",
        audience: "",
        language: "en",
        detailLevel: "standard",
        targetDuration: "60-90s",
    });

    const [isPinned, setIsPinned] = useState(false);
    const { getToken } = useAuth();
    const [currentJobId, setCurrentJobId] = useState(null);
    const [historyJob, setHistoryJob] = useState(null);
    const openJobSecurely = useReverification((id) => getJobById(id, getToken));

    // 1. Reload par saved output recover karne ke liye initial state
    const [savedResult, setSavedResult] = useState(() => {
        const cached = sessionStorage.getItem("mentos_last_result");
        return cached ? JSON.parse(cached) : null;
    });

    const { generate, loading, result: apiResult, error, clarification } = useGenerate();
    const [clarificationAnswer, setClarificationAnswer] = useState("");

    // 2. Clear result logic
    const result = historyJob || apiResult || savedResult;
    const started = loading || !!result;

    // 3. Sync API Result with SessionStorage
    useEffect(() => {
        if (apiResult) {
            sessionStorage.setItem("mentos_last_result", JSON.stringify(apiResult));
        }
    }, [apiResult]);

    const detectSourceType = (f, t) => {
        if (f) {
            const ext = f.name?.split(".").pop()?.toLowerCase();
            if (ext === "pdf") return "pdf";
            if (["docx", "doc", "odt", "rtf"].includes(ext)) return "docx";
            if (["sol"].includes(ext)) return "sol";
            if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "image";
            if (["mp3", "wav", "m4a"].includes(ext)) return "audio";
            if (["mp4", "mov", "webm"].includes(ext)) return "video";
            return "text";
        }
        if (t && /^https?:\/\/\S+$/i.test(t.trim())) {
            return "url";
        }
        return "text";
    };

    const handleSubmit = (extra = {}) => {
        if (outputTypes.length === 0) {
            alert("Select at least one output type to generate.");
            return;
        }
        if (!file && !text?.trim() && !extra.jobId) {
            alert("Please provide some source content, upload a file, or paste a link.");
            return;
        }
        if (!extra.jobId) {
            setElapsed(0);
            setSavedResult(null);
            setHistoryJob(null);
            sessionStorage.removeItem("mentos_last_result");
        }
        const sourceType = detectSourceType(file, text);
        generate({ file, sourceType, rawText: text, outputTypes, config, ...extra });
    };

    const handleAnswerClarification = () => {
        if (!clarificationAnswer.trim()) {
            alert("Enter a short answer, or proceed with available context.");
            return;
        }
        handleSubmit({
            jobId: clarification.jobId,
            clarificationAnswers: clarificationAnswer.trim(),
        });
        setClarificationAnswer("");
    };

    const handleProceedAnyway = () => {
        handleSubmit({
            jobId: clarification.jobId,
            overrideClarification: true,
        });
        setClarificationAnswer("");
    };

    const handleNewDocument = () => {
        setFile(null);
        setText("");
        setSavedResult(null);
        setHistoryJob(null);
        setCurrentJobId(null);
        sessionStorage.removeItem("mentos_last_result");
        setClarificationAnswer("");
    };

    const handleSelectJob = async (job) => {
        try {
            let fullJob;
            try {
                fullJob = await openJobSecurely(job._id);
            } catch {
                // If reverification fails or isn't enabled in Clerk project, fallback to authenticated fetch
                fullJob = await getJobById(job._id, getToken);
            }
            setHistoryJob(fullJob);
            setCurrentJobId(job._id);
        } catch (err) {
            console.error("Failed to load job:", err);
            alert("Could not load job details.");
        }
    };


    useEffect(() => {
        if (!loading) return undefined;
        const start = Date.now();
        const interval = setInterval(() => {
            setElapsed(((Date.now() - start) / 1000).toFixed(1));
        }, 100);
        return () => clearInterval(interval);
    }, [loading]);



    return (
        <div className="flex h-screen bg-[#F0EEE6] text-zinc-900 font-sans overflow-hidden selection:bg-teal-200 selection:text-teal-900">

            {/* Grid Lines Background */}
            <div
                className="fixed inset-0 pointer-events-none z-0 opacity-40"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #d4d4d8 1px, transparent 1px),
            linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
                }}
            />

            {/* Sidebar */}

            <Sidebar
                isPinned={isPinned}
                setIsPinned={setIsPinned}
                onNewDocument={handleNewDocument}
                onSelectJob={handleSelectJob}
                activeJobId={currentJobId}
                refreshTrigger={result?._id}
            />

            {/* Main Content Area */}
            <main
                className={`flex-1 relative h-full transition-all duration-300 ease-in-out z-10 ${isPinned ? "ml-[272px]" : "ml-[88px]"
                    }`}
            >
                <div className="h-full overflow-y-auto custom-scrollbar relative px-6 lg:px-12 pt-12 pb-20">

                    <div className={`w-full max-w-[1400px] mx-auto transition-all duration-700 ease-in-out ${started ? "flex flex-col xl:flex-row gap-8 xl:gap-12" : "flex flex-col justify-center min-h-[80vh]"
                        }`}>

                        {/* Left Column (Inputs & Controls) */}
                        <div className={`w-full transition-all duration-500 flex flex-col ${started ? "xl:w-[480px] shrink-0" : "max-w-3xl mx-auto items-center"
                            }`}>

                            {!started && (
                                <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-full pl-3 pr-1 py-1 text-xs font-semibold text-zinc-500 mb-6 shadow-sm">
                                        Built for SIH 2026
                                        <span className="bg-teal-500 text-white rounded-full px-2 py-0.5 ml-1">Beta</span>
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-serif text-zinc-900 tracking-tight mb-4 leading-[1.15]">
                                        One source.<br />Every format.
                                    </h1>
                                    <p className="text-zinc-500 text-lg max-w-lg mx-auto leading-relaxed">
                                        Upload anything, pick your desired formats, and let our AI generate perfectly structured content instantly.
                                    </p>
                                </div>
                            )}

                            <div className="w-full">
                                <ConsoleInput file={file} setFile={setFile} text={text} setText={setText} onSubmit={handleSubmit} disabled={loading} />
                            </div>

                            {!started && (
                                <div className="w-full mt-4">
                                    <QuickPrompts onSelect={setText} />
                                </div>
                            )}

                            <div className={`w-full bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-zinc-200 shadow-sm transition-all duration-700 ${started ? "mt-8" : "mt-10"
                                }`}>
                                <OutputChips selected={outputTypes} setSelected={setOutputTypes} />
                                <ConfigPanel config={config} setConfig={setConfig} />
                            </div>

                            {error && (
                                <div className="w-full mt-4 bg-red-50 text-red-600 border border-red-200 p-4 rounded-2xl text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            {!started && (
                                <div className="w-full pt-10 flex justify-center">
                                    <PoweredByRow />
                                </div>
                            )}
                        </div>

                        {/* Right Column (Results / Preview) */}
                        {/* Right Column (Results / Preview) */}
                        {started && (
                            <div className="flex-1 w-full xl:sticky xl:top-[40px] xl:h-[calc(100vh-80px)] animate-in fade-in slide-in-from-right-8 duration-700">
                                {loading ? (
                                    <div className="h-full min-h-[500px] w-full bg-white/80 backdrop-blur-xl rounded-3xl border border-zinc-200 shadow-xl flex items-center justify-center">
                                        <LoadingSpinner elapsed={elapsed}/>
                                    </div>
                                ) : (
                                    <PreviewPanel
                                        outputs={result.outputs}
                                        context={result.context}
                                        blockchainProof={result.blockchainProof}
                                        getToken={getToken}
                                        jobId={result._id}
                                        onClose={handleNewDocument}
                                    />
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {clarification && !loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm px-4">
                    <div className="w-full max-w-lg bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-700 mb-2">
                            Clarification needed
                        </p>
                        <h2 className="text-xl font-serif text-zinc-900 mb-2">Need a bit more context</h2>
                        <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                            {clarification.clarificationQuestion}
                        </p>
                        <textarea
                            value={clarificationAnswer}
                            onChange={(e) => setClarificationAnswer(e.target.value)}
                            rows={4}
                            placeholder="Type your answer here…"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 mb-4"
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                type="button"
                                onClick={handleAnswerClarification}
                                className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium"
                            >
                                Submit Answer
                            </button>
                            <button
                                type="button"
                                onClick={handleProceedAnyway}
                                className="flex-1 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 px-4 py-2.5 rounded-xl text-sm font-medium"
                            >
                                Proceed with Available Context
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
