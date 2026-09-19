const { askClaude } = require("../../services/llm.service");
const { getDomainGuidance } = require("./domainTone");
const { getLanguageInstruction } = require("./languageInstruction");

const advisoryGenerator = async ({ context, config }) => {
    const domainGuidance = getDomainGuidance(context.sourceCategory);
    const languageInstruction = getLanguageInstruction(config.language);

    const prompt = `
Write a structured advisory document based on the following content.

Summary: ${context.summary}
Key points: ${context.keyPoints.join(", ")}
Domain: ${context.domain}

Tone: ${config.tone || "formal"}
Audience: ${config.audience || "relevant stakeholders"}
Detail level: ${config.detailLevel || "standard"}

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

    return askClaude(prompt, 1200);
};

module.exports = { advisoryGenerator };