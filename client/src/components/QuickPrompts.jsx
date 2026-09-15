import { Newspaper, ShieldAlert, FileText, FlaskConical, AlertTriangle, MessageSquare } from "lucide-react";

const PROMPTS = [
  { icon: Newspaper, label: "News Article", example: "Paste a news article to summarize and share across channels..." },
  { icon: ShieldAlert, label: "Threat Intel", example: "Paste a threat intelligence report to convert into an advisory..." },
  { icon: FileText, label: "Policy Document", example: "Paste a policy document to generate a stakeholder briefing..." },
  { icon: FlaskConical, label: "Research Paper", example: "Paste a research paper to turn into an executive summary..." },
  { icon: AlertTriangle, label: "Incident Report", example: "Paste an incident report to generate an advisory notice..." },
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