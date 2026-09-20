const { askClaude } = require("../../services/llm.service");
const { getDomainGuidance } = require("./domainTone");
const { getLanguageInstruction } = require("./languageInstruction");
const { getMaxTokens, getDepthInstruction } = require("./tokenBudget");

const advisoryGenerator = async ({ context, config }) => {
    const domainGuidance = getDomainGuidance(context.sourceCategory);
    const languageInstruction = getLanguageInstruction(config.language);

    const prompt = `
Write a structured advisory document based on the following content.

Summary: ${context.summary}
Key points: ${context.keyPoints.join(", ")}
Domain: ${context.domain}
CVE IDs: ${(context.cveIds || []).join(", ") || "None"}
Risk Severity: ${context.riskSeverity || "N/A"}

Tone: ${config.tone || "formal"}
Audience: ${config.audience || "relevant stakeholders"}
${getDepthInstruction(config.detailLevel)}

${domainGuidance ? `Domain Guidance: ${domainGuidance}` : ""}
${languageInstruction ? `Language: ${languageInstruction}` : ""}

Structure the advisory with these sections:
1. Title
2. Summary
3. Key Findings / Details (bullet points)
4. Recommended Actions
5. Contact / Next Steps (generic placeholder if not specified)

Write ONLY the advisory content, ready to publish.
`;

    return askClaude(prompt, getMaxTokens(config.detailLevel));
};

module.exports = { advisoryGenerator };
