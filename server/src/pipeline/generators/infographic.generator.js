const { askClaude } = require("../../services/llm.service");
const { getDomainGuidance } = require("./domainTone");
const { getLanguageInstruction } = require("./languageInstruction");

const infographicGenerator = async ({ context, config }) => {
    const domainGuidance = getDomainGuidance(context.sourceCategory);
    const languageInstruction = getLanguageInstruction(config.language);

    const prompt = `
Create infographic content based on the following — this will guide a designer, so describe layout and key messaging clearly.

Summary: ${context.summary}
Key points: ${context.keyPoints.join(", ")}
Domain: ${context.domain}

${domainGuidance ? `Domain Guidance: ${domainGuidance}` : ""}
${languageInstruction ? `Language: ${languageInstruction}` : ""}

Respond ONLY with valid JSON in this exact shape, no other text:
{
  "headline": "main headline for the infographic",
  "sections": [
    { "label": "short label", "stat_or_point": "a specific number, percentage, or short punchy phrase — NOT a generic 'Step N' label", "description": "one-line description" }
  ],
  "layoutSuggestion": "brief note on how sections should be visually arranged (e.g. top-to-bottom flow, comparison columns)"
}

Include 3-5 sections.
`;

    return askClaude(prompt, 900);
};

module.exports = { infographicGenerator };