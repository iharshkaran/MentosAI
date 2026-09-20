import { Newspaper, ShieldAlert, FileText, FlaskConical, AlertTriangle, MessageSquare, FileSearch, Radar, Bug, Briefcase } from "lucide-react";

const PROMPTS = [
  { icon: FileSearch, label: "Smart Contract Audit", example: "Audit this Solidity smart contract for reentrancy, access control, oracle manipulation, and gas issues. Produce a severity-ranked findings report with remediations." },
  { icon: Radar, label: "APT Threat Intel", example: "Produce an APT threat intelligence brief covering actor TTPs, IOCs, affected sectors, CVE mapping, and SOC detection/hunting recommendations." },
  { icon: Bug, label: "Zero-Day Advisory", example: "Draft a zero-day advisory: vulnerability summary, exploitability, affected products, emergency mitigations, and patch/workaround guidance for national cyber defense teams." },
  { icon: Briefcase, label: "CISO Brief", example: "Create a CISO-ready executive brief: business risk, likely impact, residual risk, board talking points, and a 72-hour action plan." },
  { icon: ShieldAlert, label: "Threat Intel", example: "Paste a threat intelligence report to convert into an advisory..." },
  { icon: AlertTriangle, label: "Incident Report", example: "Paste an incident report to generate an advisory notice..." },
  { icon: Newspaper, label: "News Article", example: "Paste a news article to summarize and share across channels..." },
  { icon: FileText, label: "Policy Document", example: "Paste a policy document to generate a stakeholder briefing..." },
  { icon: FlaskConical, label: "Research Paper", example: "Paste a research paper to turn into an executive summary..." },
  { icon: MessageSquare, label: "Free-form Prompt", example: "Just describe what you want in your own words..." },
];

const QuickPrompts = ({ onSelect }) => (
  <div className="flex flex-wrap justify-center gap-2.5 mt-6 max-w-3xl mx-auto">
    {PROMPTS.map(({ icon: Icon, label, example }) => (
      <button
        key={label}
        type="button"
        onClick={() => onSelect(example)}
        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white border border-zinc-200/80 hover:border-teal-400/40 text-zinc-600 hover:text-zinc-900 text-[13px] font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
      >
        <Icon size={15} className="text-zinc-400 group-hover:text-teal-500 transition-colors duration-300" />
        {label}
      </button>
    ))}
  </div>
);

export default QuickPrompts;
