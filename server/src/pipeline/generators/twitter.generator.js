const { askClaude } = require("../../services/llm.service");
const { getDomainGuidance } = require("./domainTone");
const { getLanguageInstruction } = require("./languageInstruction");

const twitterGenerator = async ({ context, config }) => {
    const domainGuidance = getDomainGuidance(context.sourceCategory);
    const languageInstruction = getLanguageInstruction(config.language);

    const prompt = `
Write a Twitter/X post (or short thread if needed) based on the following content.

Summary: ${context.summary}
Key points: ${context.keyPoints.join(", ")}
Domain: ${context.domain}

Tone: ${config.tone || "engaging"}
Audience: ${config.audience || "general public"}

${domainGuidance ? `Domain Guidance: ${domainGuidance}` : ""}
${languageInstruction ? `Language: ${languageInstruction}` : ""}

Rules:
- Each tweet must be under 280 characters.
- If a thread is needed, number them like "1/", "2/", etc.
- Keep it punchy and platform-optimized, not just a shortened paragraph.
- Write ONLY the tweet(s), ready to publish.
`;

    return askClaude(prompt, 500);
};

module.exports = { twitterGenerator };