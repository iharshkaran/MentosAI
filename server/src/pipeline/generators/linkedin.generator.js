const { askClaude } = require("../../services/llm.service");
const { getDomainGuidance } = require("./domainTone");
const { getLanguageInstruction } = require("./languageInstruction");

const linkedinGenerator = async ({ context, config }) => {
    const domainGuidance = getDomainGuidance(context.sourceCategory);
    const languageInstruction = getLanguageInstruction(config.language);

    const prompt = `
Write a professional LinkedIn post based on the following content summary.

Summary: ${context.summary}
Key points: ${context.keyPoints.join(", ")}
Domain: ${context.domain}

Tone: ${config.tone || "professional"}
Audience: ${config.audience || "general professional audience"}

${domainGuidance ? `Domain Guidance: ${domainGuidance}` : ""}
${languageInstruction ? `Language: ${languageInstruction}` : ""}

Write ONLY the LinkedIn post text, ready to publish. Keep it engaging, 150-250 words, with appropriate line breaks. Do not include hashtags unless naturally relevant.
`;

    return askClaude(prompt, 1000);
};

module.exports = { linkedinGenerator };