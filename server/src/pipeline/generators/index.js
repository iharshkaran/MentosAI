const { linkedinGenerator } = require("./linkedin.generator");

// Abhi sirf linkedin ready hai — baaki generators isi pattern mein baad mein add honge
const generatorRegistry = {
  linkedin: linkedinGenerator,
  // twitter: twitterGenerator,
  // advisory: advisoryGenerator,
  // execSummary: execSummaryGenerator,
  // presentation: presentationGenerator,
  // infographic: infographicGenerator,
  // videoPackage: videoPackageGenerator,
};

module.exports = { generatorRegistry };