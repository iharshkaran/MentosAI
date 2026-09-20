import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Sidebar from "../components/Sidebar";
import PreviewPanel from "../components/PreviewPanel";
import { getJobById } from "../services/api";

const ConversationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [isPinned, setIsPinned] = useState(false);

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
      {job?._id === id && <PreviewPanel outputs={job.outputs} context={job.context} blockchainProof={job.blockchainProof} jobId={job._id} getToken={getToken} onClose={() => navigate("/dashboard")} />}
    </main>
  </div>;
};

export default ConversationPage;
