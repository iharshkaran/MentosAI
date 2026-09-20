const SCALE_PRINCIPLE =
  "Scale depth to match richness of source content. Avoid artificial padding or over-compression.";

const getMaxTokens = (detailLevel) => {
  const level = (detailLevel || "standard").toLowerCase();
  if (level === "brief") return 1200;
  if (level === "detailed") return 8000;
  return 3000;
};

const getDepthInstruction = (detailLevel) => {
  const level = (detailLevel || "standard").toLowerCase();
  if (level === "brief") {
    return `Detail level: brief. Stay within 800–1,200 tokens of useful content. ${SCALE_PRINCIPLE}`;
  }
  if (level === "detailed") {
    return `Detail level: detailed. Use 4,000–8,000 tokens when the source is rich enough. ${SCALE_PRINCIPLE}`;
  }
  return `Detail level: standard. Use 2,000–3,000 tokens. ${SCALE_PRINCIPLE}`;
};

module.exports = { SCALE_PRINCIPLE, getMaxTokens, getDepthInstruction };
