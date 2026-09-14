const { askClaude } = require("../../services/llm.service");

const infographicGenerator = async ({ context, config }) => {
    const prompt = `
Create infographic content based on the following — this will guide a designer, so describe layout and key messaging clearly.

Summary: ${context.summary}
Key points: ${context.keyPoints.join(", ")}
Domain: ${context.domain}

Respond ONLY with valid JSON in this exact shape, no other text:
{
  "headline": "main headline for the infographic",
  "sections": [
    { "label": "short label", "stat_or_point": "a number, stat, or key point", "description": "one-line description" }
  ],
  "layoutSuggestion": "brief note on how sections should be visually arranged (e.g. top-to-bottom flow, comparison columns)"
}

Include 3-5 sections.
`;

    return askClaude(prompt, 900);
};

module.exports = { infographicGenerator };