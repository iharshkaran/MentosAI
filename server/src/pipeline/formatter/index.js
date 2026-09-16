const { toText } = require("./toText");
const { toPptx } = require("./toPptx");
const { toPdf } = require("./toPdf");
const { toInfographicImage } = require("./toInfographicImage");

const formatOutput = async (type, content) => {
  switch (type) {
    case "presentation":
      return toPptx(content);
      
    case "advisory":
    case "execSummary":
    case "threatIntel":
      return toPdf(type, content);
      
    case "infographic":
      return toInfographicImage(content);
      
    case "contractAudit":
    case "linkedin":
    case "twitter":
    case "videoPackage":
    default:
      return toText(type, content);
  }
};

module.exports = { formatOutput };