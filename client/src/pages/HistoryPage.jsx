import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Sidebar from "../components/Sidebar";
import { getJobs } from "../services/api";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => { getJobs(getToken).then(setJobs).catch(() => setJobs([])); }, [getToken]);
  const filtered = jobs.filter((job) => job.outputTypes.join(" ").toLowerCase().includes(query.toLowerCase()));
  return <div className="flex min-h-screen bg-[#F0EEE6] text-zinc-900">
    <Sidebar isPinned={isPinned} setIsPinned={setIsPinned} onNewDocument={() => navigate("/dashboard")} onSelectJob={(job) => navigate(`/c/${job._id}`)} activeJobId={null} refreshTrigger={null} />
    <main className={`flex-1 px-6 py-12 ${isPinned ? "ml-[272px]" : "ml-[88px]"}`}>
      <div className="mx-auto max-w-4xl"><h1 className="font-serif text-4xl">Generation history</h1><p className="mt-2 text-zinc-500">Open a previous intelligence package.</p>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter by output type…" className="mt-6 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3" />
        <div className="mt-4 space-y-3">{filtered.map((job) => <button key={job._id} onClick={() => navigate(`/c/${job._id}`)} className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5 text-left hover:border-teal-500"><span><strong>{job.outputTypes.join(", ")}</strong><small className="mt-1 block text-zinc-500">{new Date(job.createdAt).toLocaleString()}</small></span><span className="text-sm text-zinc-500">{job.status}</span></button>)}{filtered.length === 0 && <p className="py-10 text-center text-zinc-500">No generations found.</p>}</div>
      </div>
    </main>
  </div>;
};

export default HistoryPage;
