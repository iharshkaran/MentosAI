import { ShieldAlert, AlertTriangle, CheckCircle, Flame, FileCode } from "lucide-react";

const parseJson = (raw) => {
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : cleaned);
  } catch {
    return null;
  }
};

const SEVERITY_COLORS = {
  critical: "bg-red-500/10 text-red-600 border-red-500/30",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
};

const ContractAuditPreview = ({ rawContent }) => {
  const data = parseJson(rawContent);

  if (!data) {
    return (
      <div className="font-mono text-xs whitespace-pre-wrap text-zinc-700 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
        {rawContent}
      </div>
    );
  }

  const {
    contractName = "Smart Contract Audit",
    overallRiskScore = "High",
    executiveSummary,
    vulnerabilities = [],
    gasOptimizations = [],
  } = data;

  const scoreKey = overallRiskScore.toLowerCase();
  const badgeColor = SEVERITY_COLORS[scoreKey] || SEVERITY_COLORS.high;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-zinc-900 text-white rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl">
            <FileCode size={20} className="text-teal-400" />
          </div>
          <div>
            <h3 className="font-semibold text-base">{contractName}</h3>
            <p className="text-xs text-zinc-400">Automated Smart Contract Security Audit</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
          <ShieldAlert size={14} />
          <span>Risk: {overallRiskScore}</span>
        </div>
      </div>

      {/* Executive Summary */}
      {executiveSummary && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Executive Summary</h4>
          <p className="text-sm text-zinc-700 leading-relaxed">{executiveSummary}</p>
        </div>
      )}

      {/* Vulnerabilities */}
      {vulnerabilities.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Identified Vulnerabilities ({vulnerabilities.length})
          </h4>
          <div className="space-y-3">
            {vulnerabilities.map((vuln, idx) => {
              const sev = (vuln.severity || "medium").toLowerCase();
              const badge = SEVERITY_COLORS[sev] || SEVERITY_COLORS.medium;

              return (
                <div key={idx} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-zinc-900 flex items-center gap-2">
                      <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                      {vuln.issue}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${badge}`}>
                      {vuln.severity}
                    </span>
                  </div>

                  {vuln.impact && (
                    <p className="text-xs text-zinc-600">
                      <strong className="text-zinc-800">Impact: </strong>
                      {vuln.impact}
                    </p>
                  )}

                  {vuln.remediation && (
                    <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-lg p-2.5 text-xs text-emerald-900">
                      <strong className="text-emerald-950 flex items-center gap-1 mb-1">
                        <CheckCircle size={12} className="text-emerald-600" /> Remediation:
                      </strong>
                      {vuln.remediation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Gas Optimizations */}
      {gasOptimizations.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-1.5">
            <Flame size={14} className="text-amber-500" /> Gas Optimizations
          </h4>
          <ul className="space-y-1.5">
            {gasOptimizations.map((opt, i) => (
              <li key={i} className="text-xs text-zinc-600 flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>{opt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContractAuditPreview;
