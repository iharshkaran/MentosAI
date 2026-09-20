import { useState } from "react";

const OnboardingModal = ({ onComplete }) => {
  const [form, setForm] = useState({ role: "", organizationName: "", primaryAudience: "", tone: "professional", language: "en" });
  const [saving, setSaving] = useState(false);
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    await onComplete({
      onboardingCompleted: true,
      profile: { role: form.role, organizationName: form.organizationName, primaryAudience: form.primaryAudience },
      defaults: { tone: form.tone, language: form.language, detailLevel: "standard", strictSourceGrounding: true },
    });
  };

  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/45 backdrop-blur-sm p-4">
    <form onSubmit={submit} className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-7 shadow-2xl">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-teal-700">Welcome to MentosAI</p>
      <h2 className="text-2xl font-serif text-zinc-900">Personalize your workspace</h2>
      <p className="mt-2 text-sm text-zinc-500">These defaults improve every generation. You can change them anytime.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-zinc-700">What do you do?<input required value={form.role} onChange={(e) => update("role", e.target.value)} placeholder="e.g. Cybersecurity analyst" className="mt-1.5 w-full rounded-xl border border-zinc-200 p-2.5" /></label>
        <label className="text-sm text-zinc-700">Organization (optional)<input value={form.organizationName} onChange={(e) => update("organizationName", e.target.value)} placeholder="e.g. Team KALKI" className="mt-1.5 w-full rounded-xl border border-zinc-200 p-2.5" /></label>
        <label className="text-sm text-zinc-700">Primary audience<input required value={form.primaryAudience} onChange={(e) => update("primaryAudience", e.target.value)} placeholder="e.g. CISOs and SOC teams" className="mt-1.5 w-full rounded-xl border border-zinc-200 p-2.5" /></label>
        <label className="text-sm text-zinc-700">Preferred tone<select value={form.tone} onChange={(e) => update("tone", e.target.value)} className="mt-1.5 w-full rounded-xl border border-zinc-200 p-2.5"><option value="professional">Professional</option><option value="authoritative">Authoritative</option><option value="friendly">Friendly</option><option value="technical">Technical</option></select></label>
      </div>
      <button disabled={saving} className="mt-6 w-full rounded-xl bg-zinc-900 py-3 text-sm font-medium text-white disabled:opacity-60">{saving ? "Saving…" : "Continue to workspace"}</button>
    </form>
  </div>;
};

export default OnboardingModal;
