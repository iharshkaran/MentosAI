const { askClaude } = require("../../services/llm.service");

const execSummaryGenerator = async ({ context, config }) => {
    const prompt = `
Write a concise executive summary based on the following content.

Summary: ${context.summary}
Key points: ${context.keyPoints.join(", ")}
Domain: ${context.domain}
Intent: ${context.intent}

Tone: ${config.tone || "professional"}
Audience: ${config.audience || "executives and decision-makers"}

Rules:
- Maximum 200 words.
- No fluff — lead with the most important takeaway.
- End with a one-line "Bottom line" statement.

Write ONLY the executive summary, ready to share.
`;

    return askClaude(prompt, 600);
};

module.exports = { execSummaryGenerator };