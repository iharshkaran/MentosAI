const { askClaude } = require("../../services/llm.service");
const { getDomainGuidance } = require("./domainTone");

const threatIntelGenerator = async ({ context, config }) => {
  const domainGuidance = getDomainGuidance(context.sourceCategory);

  const prompt = `
You are a Senior Threat Intelligence Analyst producing an actionable Threat Advisory / Security Alert.

Source Summary: ${context.summary}
Key Points: ${context.keyPoints.join("; ")}
Detected Entities / IOCs: ${context.entities.join(", ")}
CVE IDs: ${context.cveIds ? context.cveIds.join(", ") : "None"}
Risk Severity: ${context.riskSeverity || "High"}
Domain Guidance: ${domainGuidance}

Target Audience: ${config.audience || "SOC Analysts, CISOs, & IT Security Teams"}
Tone: ${config.tone || "authoritative and urgent"}
Detail Level: ${config.detailLevel || "standard"}

Generate a comprehensive Threat Intelligence Advisory formatted in clean Markdown with the following structured sections:
1. Executive Summary & Severity Rating
2. Threat Description & Vector Analysis
3. Affected Systems & Impact
4. Indicators of Compromise (IOCs) & CVE References
5. Immediate Mitigation & Remediation Actions (Numbered Steps)

Write high-quality, professional security advisory content. Do NOT wrap output in JSON, return direct Markdown.
`;

  return askClaude(prompt, 2048);
};

module.exports = { threatIntelGenerator };