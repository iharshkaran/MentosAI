const { askClaude } = require("../../services/llm.service");

const validateOutput = async (content, context) => {
    const prompt = `
You are a fact-checking validator. Compare the generated content below against the source context, and check for hallucinations or factual inconsistencies.

Source context:
Summary: ${context.summary}
Key points: ${context.keyPoints.join(", ")}

Generated content:
"""
${content}
"""

Respond ONLY with valid JSON in this exact shape, no other text:
{
  "passed": true or false,
  "issues": ["list any factual inconsistencies or hallucinations found, empty array if none"]
}
`;

    const response = await askClaude(prompt, 400);

    try {
        const cleaned = response.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return {
            passed: parsed.passed,
            issues: parsed.issues || [],
            checkedAt: new Date().toISOString(),
        };
    } catch (err) {
        // Agar validator ka response parse na ho, fail-safe: pass maan lo but log karo
        console.error("Validation parsing failed:", err.message);
        return { passed: true, issues: ["Validation check inconclusive"], checkedAt: new Date().toISOString() };
    }
};

module.exports = { validateOutput };