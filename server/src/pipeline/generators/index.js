const { linkedinGenerator } = require("./linkedin.generator");
const { twitterGenerator } = require("./twitter.generator");
const { advisoryGenerator } = require("./advisory.generator");
const { execSummaryGenerator } = require("./execSummary.generator");
const { presentationGenerator } = require("./presentation.generator");
const { infographicGenerator } = require("./infographic.generator");
const { videoPackageGenerator } = require("./videoPackage.generator");

const generatorRegistry = {
  linkedin: linkedinGenerator,
  twitter: twitterGenerator,
  advisory: advisoryGenerator,
  execSummary: execSummaryGenerator,
  presentation: presentationGenerator,
  infographic: infographicGenerator,
  videoPackage: videoPackageGenerator,
};

module.exports = { generatorRegistry };