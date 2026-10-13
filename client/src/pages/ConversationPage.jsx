import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Download, FileText } from "lucide-react";
import Sidebar from "../components/Sidebar";
import PreviewPanel from "../components/PreviewPanel";
import { downloadSourceFile, getJobById } from "../services/api";

const ConversationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  const handleDownloadSource = async (file) => {
    try {
      const blob = await downloadSourceFile(id, file._id, getToken);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.originalName;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("Could not download this source file.");
    }
  };

  useEffect(() => {
    let active = true;
    getJobById(id, getToken).then((data) => {
      if (active) setJob(data);
    }).catch((err) => {
      if (active) setError(err.response?.status === 404 ? "This generation was not found." : "Could not load this generation.");
    });
    return () => { active = false; };
  }, [id, getToken]);

  return <div className="flex min-h-screen bg-[#F0EEE6] text-zinc-900">
    <Sidebar isPinned={isPinned} setIsPinned={setIsPinned} onNewDocument={() => navigate("/dashboard")} onSelectJob={(item) => navigate(`/c/${item._id}`)} activeJobId={id} refreshTrigger={id} />
    <main className={`flex-1 px-6 py-12 ${isPinned ? "ml-[272px]" : "ml-[88px]"}`}>
      <button onClick={() => navigate("/dashboard")} className="mb-6 text-sm text-zinc-500 hover:text-zinc-900">← New generation</button>
      {!job && !error && <p className="text-zinc-500">Loading generation…</p>}
      {error && <div className="rounded-2xl bg-white p-8 shadow-sm"><h1 className="text-xl font-semibold">Generation unavailable</h1><p className="mt-2 text-zinc-500">{error}</p></div>}
      {job?._id === id && <>
        {job.sourceFiles?.length > 0 && <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-800"><FileText size={16} /> Source files</h2>
          <ul className="space-y-2">
            {job.sourceFiles.map((file) => <li key={file._id} className="flex items-center justify-between gap-4 rounded-xl bg-zinc-50 px-3 py-2.5">
              <span className="truncate text-sm text-zinc-700">{file.originalName}</span>
              <button onClick={() => handleDownloadSource(file)} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-950" aria-label={`Download ${file.originalName}`}>
                <Download size={15} /> Download
              </button>
            </li>)}
          </ul>
        </section>}
        <PreviewPanel outputs={job.outputs} context={job.context} blockchainProof={job.blockchainProof} jobId={job._id} getToken={getToken} onClose={() => navigate("/dashboard")} />
      </>}
    </main>
  </div>;
};

export default ConversationPage;
