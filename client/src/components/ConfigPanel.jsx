import { useState } from "react";
import { Settings2, Users, AlignLeft, Globe2 } from "lucide-react";

// Language Data
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ar", label: "Arabic" },
  { code: "pt", label: "Portuguese" },
  { code: "zh", label: "Chinese" },
];

// Audience Suggestions Data
const AUDIENCE_SUGGESTIONS = [
  "Executives", "Engineers", "General Public", "Stakeholders", "Security Team", "Investors",
];

const ConfigPanel = ({ config, setConfig }) => {
  const [audienceFocused, setAudienceFocused] = useState(false);

  const update = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  // Shared CSS Classes
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
      <div className="relative group">
        <label className={labelClasses}>
          <Users size={14} className="text-zinc-400" /> Audience
        </label>
        <input
          type="text"
          value={config.audience}
          onChange={(e) => update("audience", e.target.value)}
          onFocus={() => setAudienceFocused(true)}
          onBlur={() => setTimeout(() => setAudienceFocused(false), 150)}
          placeholder="e.g. Executives, Engineers..."
          className={inputClasses}
        />
        {/* Audience Suggestions Dropdown */}
        {audienceFocused && (
          <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-zinc-200 rounded-xl shadow-lg p-2 flex flex-wrap gap-1.5">
            {AUDIENCE_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={() => update("audience", s)}
                className="px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-teal-50 hover:text-teal-700 text-xs text-zinc-600 transition-colors font-medium"
              >
                {s}
              </button>
            ))}
          </div>
        )}
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
        <select
          value={config.language}
          onChange={(e) => update("language", e.target.value)}
          className={`${inputClasses} appearance-none cursor-pointer`}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>

    </div>
  );
};

export default ConfigPanel;