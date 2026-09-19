import { Check } from "lucide-react";

const OUTPUT_OPTIONS = [
  { value: "linkedin", label: "LinkedIn Post" },
  { value: "twitter", label: "X Thread" },
  { value: "advisory", label: "Advisory" },
  { value: "execSummary", label: "Exec Summary" },
  { value: "presentation", label: "Presentation" },
  { value: "infographic", label: "Infographic" },
  { value: "videoPackage", label: "Video Package" },
  { value: "threatIntel", label: "Threat Intel" },
  { value: "contractAudit", label: "Contract Audit" },
];

const OutputChips = ({ selected, setSelected }) => {
  const toggle = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="w-full space-y-3">
      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
        Select Outputs
      </label>
      <div className="flex flex-wrap gap-2.5">
        {OUTPUT_OPTIONS.map((opt) => {
          const active = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden ${
                active
                  ? "bg-zinc-900 text-white shadow-md scale-[0.98] border border-zinc-900"
                  : "bg-white/60 text-zinc-600 border border-zinc-200/80 hover:border-zinc-400 hover:bg-white hover:text-zinc-900 shadow-sm hover:shadow"
              }`}
            >
              {active && (
                <span className="animate-in zoom-in duration-200">
                  <Check size={14} strokeWidth={3} className="text-teal-400" />
                </span>
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OutputChips;