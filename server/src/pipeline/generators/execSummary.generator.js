const { askClaude } = require("../../services/llm.service");
const { getDomainGuidance } = require("./domainTone");
const { getLanguageInstruction } = require("./languageInstruction");
const { getMaxTokens, getDepthInstruction } = require("./tokenBudget");

const wordRule = (detailLevel) => {
  const level = (detailLevel || "standard").toLowerCase();
  if (level === "brief") return "Maximum 120 words.";
  if (level === "detailed") return "Write 400-600 words covering context, impact, and recommended decisions.";
  return "Maximum 200 words.";
};

const execSummaryGenerator = async ({ context, config }) => {
    const domainGuidance = getDomainGuidance(context.sourceCategory);
    const languageInstruction = getLanguageInstruction(config.language);

    const prompt = `
Write a concise executive summary based on the following content.

Summary: ${context.summary}
Key points: ${context.keyPoints.join(", ")}
Domain: ${context.domain}
Intent: ${context.intent}

Tone: ${config.tone || "professional"}
Audience: ${config.audience || "executives and decision-makers"}
${getDepthInstruction(config.detailLevel)}

${domainGuidance ? `Domain Guidance: ${domainGuidance}` : ""}
${languageInstruction ? `Language: ${languageInstruction}` : ""}

Rules:
- ${wordRule(config.detailLevel)}
- No fluff — lead with the most important takeaway.
- End with a one-line "Bottom line" statement.

Write ONLY the executive summary, ready to share.
`;

    return askClaude(prompt, getMaxTokens(config.detailLevel));
};

module.exports = { execSummaryGenerator };
