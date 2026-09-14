const { askClaude } = require("../../services/llm.service");
const { getDomainGuidance } = require("./domainTone");

const videoPackageGenerator = async ({ context, config }) => {
    const domainGuidance = getDomainGuidance(context.sourceCategory);
    
    const prompt = `
Create a complete short-video package based on the following content.

Summary: ${context.summary}
Key points: ${context.keyPoints.join(", ")}
Domain: ${context.domain}

Tone: ${config.tone || "engaging"}
Target length: ~60-90 seconds when narrated.

Respond ONLY with valid JSON in this exact shape, no other text:
{
  "script": "full narration script",
  "storyboard": [
    { "scene": 1, "visual": "description of what's shown on screen", "narration": "matching narration line" }
  ],
  "subtitles": ["subtitle line 1", "subtitle line 2"],
  "visualRecommendations": "overall style/visual direction notes"
}

Create 4-6 storyboard scenes.
`;

    return askClaude(prompt, 1800);
};

module.exports = { videoPackageGenerator };