const { askClaude } = require("../../services/llm.service");

const buildPrompt = (text) => `
You are analyzing source content that will be transformed into multiple output formats (LinkedIn posts, advisories, presentations, etc.).

Read the following content and extract structured information about it. Respond ONLY with valid JSON in this exact shape, no other text. Keep keyPoints to a maximum of 5 short items, and entities to a maximum of 8 items.

{
  "summary": "a 2-3 sentence summary of the content",
  "intent": "what the content is trying to communicate or achieve",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "entities": ["important names, organizations, or terms mentioned"],
  "domain": "the subject area, e.g. 'cybersecurity', 'finance', 'general'",
  "toneOfSource": "the tone of the original content, e.g. 'formal', 'urgent', 'neutral'"
}

Content:
"""
${text}
"""
`;

const extractContext = async (cleanText) => {
    const prompt = buildPrompt(cleanText);
    const response = await askClaude(prompt, 2048);

    try {
        const cleaned = response.replace(/```json|```/g, "").trim();
        return JSON.parse(cleaned);
    } catch (err) {
        throw new Error(`Failed to parse context extraction response: ${err.message}`);
    }
};

module.exports = { extractContext };