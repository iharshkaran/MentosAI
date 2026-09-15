import { SiReact, SiNodedotjs, SiExpress, SiMongodb, SiTailwindcss } from "react-icons/si";
import { Sparkles } from "lucide-react";

const STACK = [
  { Icon: SiReact, label: "React" },
  { Icon: SiTailwindcss, label: "Tailwind" },
  { Icon: SiNodedotjs, label: "Node.js" },
  { Icon: SiExpress, label: "Express" },
  { Icon: SiMongodb, label: "MongoDB" },
];

const PoweredByRow = () => (
  <div className="mt-20 text-center">
    <p className="text-xs uppercase tracking-widest text-muted font-body mb-5">
      Powered by
    </p>
    <div className="flex items-center justify-center gap-8 flex-wrap opacity-70">
      {STACK.map(({ Icon, label }) => (
        <Icon key={label} size={22} className="text-ink/60" title={label} />
      ))}
      <div className="flex items-center gap-1.5 text-ink/60">
        <Sparkles size={20} />
        <span className="text-sm font-body">Gemini</span>
      </div>
    </div>
  </div>
);

export default PoweredByRow;