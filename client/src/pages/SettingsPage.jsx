import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Sidebar from "../components/Sidebar";
import { getSettings, updateSettings } from "../services/api";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [isPinned, setIsPinned] = useState(false);
  const [settings, setSettings] = useState({ profile: { primaryAudience: "" }, defaults: { tone: "professional", language: "en", detailLevel: "standard", targetDuration: "60-90s" } });
  const [saved, setSaved] = useState(false);

  useEffect(() => { getSettings(getToken).then((data) => setSettings((current) => ({ ...current, ...data, profile: { ...current.profile, ...data.profile }, defaults: { ...current.defaults, ...data.defaults } }))).catch(() => {}); }, [getToken]);
  const update = (group, key, value) => setSettings((current) => ({ ...current, [group]: { ...current[group], [key]: value } }));
  const save = async () => {
    try {
      await updateSettings(settings, getToken);
      setSaved(true);
    } catch (err) {
      alert("Could not save settings: " + (err.response?.data?.message || err.message));
    }
  };

  return <div className="flex min-h-screen bg-[#F0EEE6] text-zinc-900">
    <Sidebar isPinned={isPinned} setIsPinned={setIsPinned} onNewDocument={() => navigate("/dashboard")} onSelectJob={(job) => navigate(`/c/${job._id}`)} activeJobId={null} refreshTrigger={null} />
    <main className={`flex-1 px-6 py-12 ${isPinned ? "ml-[272px]" : "ml-[88px]"}`}><div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm"><h1 className="font-serif text-4xl">Settings</h1><p className="mt-2 text-zinc-500">Your defaults apply to new generations.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2"><label className="text-sm">Default audience<input value={settings.profile.primaryAudience} onChange={(event) => update("profile", "primaryAudience", event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-200 p-3" /></label><label className="text-sm">Tone<select value={settings.defaults.tone} onChange={(event) => update("defaults", "tone", event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-200 p-3"><option value="professional">Professional</option><option value="formal">Formal</option><option value="friendly">Friendly</option><option value="authoritative">Authoritative</option></select></label><label className="text-sm">Language<select value={settings.defaults.language} onChange={(event) => update("defaults", "language", event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-200 p-3"><option value="en">English</option><option value="hi">Hindi</option></select></label><label className="text-sm">Detail level<select value={settings.defaults.detailLevel} onChange={(event) => update("defaults", "detailLevel", event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-200 p-3"><option value="brief">Brief</option><option value="standard">Standard</option><option value="detailed">Detailed</option></select></label></div>
      <button onClick={save} className="mt-8 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white">{saved ? "Saved" : "Save settings"}</button></div></main>
  </div>;
};

export default SettingsPage;
