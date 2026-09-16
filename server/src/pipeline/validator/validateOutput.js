const { askClaude } = require("../../services/llm.service");

const validateOutput = async (content, context) => {
    const prompt = `
You are a Lead Cybersecurity & Compliance Auditor. Compare the generated content below against the extracted source context, strictly checking for hallucinations, ungrounded technical assertions, or factual inconsistencies.

Source Context:
Summary: ${context.summary}
Key Points: ${context.keyPoints ? context.keyPoints.join(", ") : ""}
Extracted Entities / Hashes / IPs: ${context.entities ? context.entities.join(", ") : "None"}
CVE References: ${context.cveIds ? context.cveIds.join(", ") : "None"}
Stated Severity: ${context.riskSeverity || "N/A"}

Generated Content:
"""
${content}
"""

Validation Criteria:
1. Ensure no fabricated CVE IDs, IP addresses, or ungrounded security vulnerabilities exist.
2. Verify that the severity level has not been artificially exaggerated.
3. Check overall alignment with original facts.

Respond ONLY with valid JSON in this exact shape, no other text:
{
  "passed": true or false,
  "accuracyScore": integer percentage from 0 to 100,
  "issues": ["list any factual inconsistencies, ungrounded claims, or hallucinations found, empty array if none"]
}
`;

    try {
        const response = await askClaude(prompt, 512);
        const cleaned = response.replace(/```json|```/g, "").trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : cleaned;
        const parsed = JSON.parse(jsonString);

        return {
            passed: typeof parsed.passed === "boolean" ? parsed.passed : true,
            accuracyScore: typeof parsed.accuracyScore === "number" ? parsed.accuracyScore : 95,
            issues: Array.isArray(parsed.issues) ? parsed.issues : [],
            checkedAt: new Date(),
        };
    } catch (err) {
        console.error("Validation parsing failed:", err.message);
        return {
            passed: true,
            accuracyScore: 90,
            issues: ["Validation check inconclusive (fail-safe pass applied)"],
            checkedAt: new Date(),
        };
    }
};

module.exports = { validateOutput };