const { askClaude } = require("../../services/llm.service");
const { getDomainGuidance } = require("./domainTone");
const { getLanguageInstruction } = require("./languageInstruction");
const { getMaxTokens, getDepthInstruction } = require("./tokenBudget");

const slideGuidance = (detailLevel) => {
  const level = (detailLevel || "standard").toLowerCase();
  if (level === "brief") return "Create 4 slides: Title, Overview, Key Findings, Conclusion.";
  if (level === "detailed") return "Create 8-12 slides covering Title, Overview, detailed findings, IOCs/CVEs if present, recommendations, and Next Steps.";
  return "Create 4-6 slides: Title, Overview, 2-3 content slides based on key points, and a Conclusion/Next Steps slide.";
};

const presentationGenerator = async ({ context, config }) => {
    const domainGuidance = getDomainGuidance(context.sourceCategory);
    const languageInstruction = getLanguageInstruction(config.language);

    const prompt = `
Create presentation content (slides + speaker notes) based on the following.

Summary: ${context.summary}
Key points: ${context.keyPoints.join(", ")}
Domain: ${context.domain}

Tone: ${config.tone || "professional"}
Audience: ${config.audience || "general audience"}
${getDepthInstruction(config.detailLevel)}

${domainGuidance ? `Domain Guidance: ${domainGuidance}` : ""}
${languageInstruction ? `Language: ${languageInstruction}` : ""}

Respond ONLY with valid JSON in this exact shape, no other text:
{
  "slides": [
    { "title": "slide title", "bullets": ["point 1", "point 2"], "speakerNotes": "what to say on this slide" }
  ]
}

${slideGuidance(config.detailLevel)}
`;

    return askClaude(prompt, getMaxTokens(config.detailLevel));
};

module.exports = { presentationGenerator };
