import { Settings2, Users, AlignLeft, Globe2 } from "lucide-react";

const ConfigPanel = ({ config, setConfig }) => {
  const update = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  const inputClasses = "w-full bg-white/50 border border-zinc-200 rounded-xl py-2.5 px-3 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 focus:bg-white transition-all shadow-sm";
  const labelClasses = "text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5 ml-1";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-zinc-200/60">
      
      {/* Tone */}
      <div className="group">
        <label className={labelClasses}>
          <Settings2 size={14} className="text-zinc-400" /> Tone
        </label>
        <select
          value={config.tone}
          onChange={(e) => update("tone", e.target.value)}
          className={`${inputClasses} appearance-none cursor-pointer`}
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="urgent">Urgent</option>
          <option value="formal">Formal</option>
        </select>
      </div>

      {/* Audience */}
      <div className="group">
        <label className={labelClasses}>
          <Users size={14} className="text-zinc-400" /> Audience
        </label>
        <input
          type="text"
          value={config.audience}
          onChange={(e) => update("audience", e.target.value)}
          placeholder="e.g. Executives, Engineers..."
          className={inputClasses}
        />
      </div>

      {/* Detail Level */}
      <div className="group">
        <label className={labelClasses}>
          <AlignLeft size={14} className="text-zinc-400" /> Detail Level
        </label>
        <select
          value={config.detailLevel}
          onChange={(e) => update("detailLevel", e.target.value)}
          className={`${inputClasses} appearance-none cursor-pointer`}
        >
          <option value="brief">Brief & Concise</option>
          <option value="standard">Standard</option>
          <option value="detailed">In-depth & Detailed</option>
        </select>
      </div>

      {/* Language */}
      <div className="group">
        <label className={labelClasses}>
          <Globe2 size={14} className="text-zinc-400" /> Language
        </label>
        <input
          type="text"
          value={config.language}
          onChange={(e) => update("language", e.target.value)}
          placeholder="e.g. en, fr, hi"
          className={inputClasses}
        />
      </div>
    </div>
  );
};

export default ConfigPanel;