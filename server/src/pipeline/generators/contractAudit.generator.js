const { askClaude } = require("../../services/llm.service");
const { getDomainGuidance } = require("./domainTone");
const { getLanguageInstruction } = require("./languageInstruction");

const contractAuditGenerator = async ({ context, config }) => {
  const domainGuidance = getDomainGuidance(context.sourceCategory);
  const languageInstruction = getLanguageInstruction(config.language);

  const prompt = `
You are a Lead Smart Contract Security Auditor analyzing smart contract source code or audit reports.

Source Summary: ${context.summary}
Key Issues / Findings: ${context.keyPoints.join("; ")}
Entities / Contract References: ${context.entities.join(", ")}
Risk Severity: ${context.riskSeverity || "High"}

Detail Level: ${config.detailLevel || "standard"}

${domainGuidance ? `Domain Guidance: ${domainGuidance}` : ""}
${languageInstruction ? `Language: ${languageInstruction}` : ""}

Analyze the content and respond ONLY with valid JSON in this exact structure, no extra commentary:
{
  "contractName": "Inferred or extracted contract name (or 'Smart Contract Audit')",
  "overallRiskScore": "${context.riskSeverity || "High"}",
  "vulnerabilities": [
    {
      "issue": "Vulnerability Name (e.g. Reentrancy, Unchecked Call, Integer Overflow)",
      "severity": "Critical | High | Medium | Low",
      "impact": "Brief impact description",
      "remediation": "Recommended code fix or patch approach"
    }
  ],
  "gasOptimizations": [
    "Gas optimization recommendation 1",
    "Gas optimization recommendation 2"
  ],
  "executiveSummary": "High-level summary suitable for non-technical leadership"
}
`;

  return askClaude(prompt, 2048);
};

module.exports = { contractAuditGenerator };