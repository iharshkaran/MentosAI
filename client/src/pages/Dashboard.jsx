import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ConsoleInput from "../components/ConsoleInput";
import OutputChips from "../components/OutputChips";
import ConfigPanel from "../components/ConfigPanel";
import PreviewPanel from "../components/PreviewPanel";
import QuickPrompts from "../components/QuickPrompts";
import PoweredByRow from "../components/PoweredByRow";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGenerate } from "../hooks/useGenerate";

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [outputTypes, setOutputTypes] = useState([]);
  const [config, setConfig] = useState({
    tone: "professional",
    audience: "",
    language: "en",
    detailLevel: "standard",
  });

  const [isPinned, setIsPinned] = useState(false);

  const { generate, loading, result, error } = useGenerate();
  const started = loading || !!result;

  const handleSubmit = () => {
    if (outputTypes.length === 0) {
      alert("Select at least one output type to generate.");
      return;
    }
    generate({ file, sourceType: file ? "pdf" : "text", rawText: text, outputTypes, config });
  };

  const handleNewDocument = () => {
    setFile(null);
    setText("");
  };

  return (
    <div className="flex h-screen bg-[#F9F8F6] text-zinc-900 font-sans overflow-hidden selection:bg-teal-200 selection:text-teal-900">
      
      {/* PERFECT GRID LINES BACKGROUND */}
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

      {/* FLOATING GLASS SIDEBAR */}
      <Sidebar 
        isPinned={isPinned} 
        setIsPinned={setIsPinned} 
        onNewDocument={handleNewDocument} 
      />

      {/* MAIN CONTENT AREA */}
      {/* Margin calculation: 16px (sidebar left gap) + sidebar width + gap */}
      <main 
        className={`flex-1 relative h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 ${
          isPinned ? "ml-[288px]" : "ml-[104px]"
        }`}
      >
        <div className="h-full overflow-y-auto custom-scrollbar relative px-6 lg:px-12 pt-12 pb-20">
          
          <div className={`w-full max-w-[1400px] mx-auto transition-all duration-700 ease-in-out ${
            started ? "flex flex-col xl:flex-row gap-8 xl:gap-12" : "flex flex-col justify-center min-h-[80vh]"
          }`}>
            
            {/* Left Column (Inputs & Controls) */}
            <div className={`w-full transition-all duration-500 flex flex-col ${
              started ? "xl:w-[480px] shrink-0" : "max-w-3xl mx-auto items-center"
            }`}>
              
              {!started && (
                <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-full pl-3 pr-1 py-1 text-xs font-semibold text-zinc-500 mb-6 shadow-sm">
                    Built for SIH 2026
                    <span className="bg-teal-500 text-white rounded-full px-2 py-0.5 ml-1">Beta</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-serif text-zinc-900 tracking-tight mb-4 leading-[1.15]">
                    One source.<br/>Every format.
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

              <div className={`w-full bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-zinc-200 shadow-sm transition-all duration-700 ${
                started ? "mt-8" : "mt-10"
              }`}>
                <OutputChips selected={outputTypes} setSelected={setOutputTypes} />
                <ConfigPanel config={config} setConfig={setConfig} />
              </div>

              {error && (
                <div className="w-full mt-4 bg-red-50 text-red-600 border border-red-200 p-4 rounded-2xl text-sm font-medium">
                  {error}
                </div>
              )}

              {/* {!started && (
                <div className="w-full pt-10 flex justify-center">
                  <PoweredByRow />
                </div>
              )} */}
            </div>

            {/* Right Column (Results / Preview) */}
            {started && (
              <div className="flex-1 w-full xl:sticky xl:top-[40px] xl:h-[calc(100vh-80px)] animate-in fade-in slide-in-from-right-8 duration-700">
                {loading ? (
                  <div className="h-full min-h-[500px] w-full bg-white/80 backdrop-blur-xl rounded-3xl border border-zinc-200 shadow-xl flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <PreviewPanel outputs={result.outputs} />
                )}
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;