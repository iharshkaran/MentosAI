const { askClaude } = require("../../services/llm.service");
const { getDomainGuidance } = require("./domainTone");
const { getLanguageInstruction } = require("./languageInstruction");
const { getMaxTokens, getDepthInstruction } = require("./tokenBudget");

const normalizeDuration = (targetDuration) => {
  const raw = (targetDuration || "60-90s").toLowerCase();
  if (raw.includes("30")) return "30s";
  if (raw.includes("3-5") || raw.includes("3–5")) return "3-5 min";
  return "60-90s";
};

const durationGuidance = (targetDuration) => {
  const duration = normalizeDuration(targetDuration);
  if (duration === "30s") {
    return {
      duration,
      scenes: "Create 3-4 storyboard scenes. Narration must fit a ~30 second read.",
    };
  }
  if (duration === "3-5 min") {
    return {
      duration,
      scenes: "Create 8-12 storyboard scenes. Narration should fit a 3-5 minute briefing.",
    };
  }
  return {
    duration: "60-90s",
    scenes: "Create 4-6 storyboard scenes. Narration should fit a 60-90 second clip.",
  };
};

const videoPackageGenerator = async ({ context, config }) => {
    const domainGuidance = getDomainGuidance(context.sourceCategory);
    const languageInstruction = getLanguageInstruction(config.language);
    const { duration, scenes } = durationGuidance(config.targetDuration);

    const prompt = `
Create a complete short-video package based on the following content.

Summary: ${context.summary}
Key points: ${context.keyPoints.join(", ")}
Domain: ${context.domain}

Tone: ${config.tone || "engaging"}
Target length: ${duration} when narrated.
${getDepthInstruction(config.detailLevel)}
${scenes}

${domainGuidance ? `Domain Guidance: ${domainGuidance}` : ""}
${languageInstruction ? `Language: ${languageInstruction}` : ""}

Respond ONLY with valid JSON in this exact shape, no other text:
{
  "script": "full narration script",
  "storyboard": [
    { "scene": 1, "visual": "description of what's shown on screen", "narration": "matching narration line" }
  ],
  "subtitles": ["subtitle line 1", "subtitle line 2"],
  "visualRecommendations": "overall style/visual direction notes"
}
`;

    return askClaude(prompt, getMaxTokens(config.detailLevel));
};

module.exports = { videoPackageGenerator };
