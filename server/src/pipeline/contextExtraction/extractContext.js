const { askClaude } = require("../../services/llm.service");
const { DOMAIN_CATEGORIES } = require("../generators/domainTone");

const buildPrompt = (text, { keyPointLimit }) => `
You are an expert Security & Blockchain Intelligence Analyst analyzing source content (Threat Reports, Smart Contract Audits, Incident Logs, Advisories, Policy Documents, etc.).

Read the following content and extract structured technical context about it. Respond ONLY with valid JSON in this exact shape, no other text.
Keep keyPoints to a maximum of ${keyPointLimit} concise items, and entities to a maximum of 10 items.

Detect ambiguity and completeness:
- Set needsClarification to true if essential information is missing (target system, exploit scope, contract address, environment, audience, or the operator's goal).
- If needsClarification is true, set clarificationQuestion to ONE targeted question that would unblock high-quality generation.
- If the source is complete enough to proceed, set needsClarification to false and clarificationQuestion to "".

{
  "summary": "a 2-3 sentence technical summary of the content",
  "intent": "what the content is trying to communicate, report, or resolve",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "entities": ["names, organizations, IP addresses, hashes, or technical terms"],
  "cveIds": ["CVE IDs found e.g. CVE-2024-1234, or empty array if none"],
  "domain": "cybersecurity | blockchain | general",
  "toneOfSource": "e.g. 'formal', 'urgent', 'authoritative', 'neutral'",
  "sourceCategory": "classify the content as exactly one of: ${DOMAIN_CATEGORIES.join(", ")}, or 'other' if none fit",
  "riskSeverity": "classify overall risk severity as exactly one of: 'Critical', 'High', 'Medium', 'Low', 'N/A'",
  "needsClarification": false,
  "clarificationQuestion": ""
}

Content:
"""
${text}
"""
`;

const extractContext = async (cleanText, { detailLevel } = {}) => {
  const keyPointLimit = detailLevel === "detailed" || (cleanText && cleanText.length > 50000) ? 20 : 5;
  const prompt = buildPrompt(cleanText, { keyPointLimit });
  const response = await askClaude(prompt, keyPointLimit > 5 ? 4096 : 2048);

  try {
    const cleaned = response.replace(/```json|```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleaned;
    const parsed = JSON.parse(jsonString);

    const keyPoints = Array.isArray(parsed.keyPoints) ? parsed.keyPoints.slice(0, keyPointLimit) : [];
    const thinInput = !cleanText || cleanText.replace(/\s/g, "").length < 80;
    const needsClarification = Boolean(parsed.needsClarification) || thinInput;
    const clarificationQuestion =
      (parsed.clarificationQuestion && String(parsed.clarificationQuestion).trim()) ||
      (needsClarification
        ? "The source is ambiguous. What target system, exploit scope, or outcome should this intelligence package cover?"
        : "");

    return {
      summary: parsed.summary || "",
      intent: parsed.intent || "",
      keyPoints,
      entities: Array.isArray(parsed.entities) ? parsed.entities : [],
      cveIds: Array.isArray(parsed.cveIds) ? parsed.cveIds : [],
      domain: parsed.domain || "cybersecurity",
      toneOfSource: parsed.toneOfSource || "neutral",
      sourceCategory: parsed.sourceCategory || "threat_intelligence",
      riskSeverity: parsed.riskSeverity || "N/A",
      needsClarification,
      clarificationQuestion,
    };
  } catch (err) {
    throw new Error(`Failed to parse context extraction response: ${err.message}`);
  }
};

module.exports = { extractContext };
