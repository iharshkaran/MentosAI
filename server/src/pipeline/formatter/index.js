const { toText } = require("./toText");
const { toPptx } = require("./toPptx");
const { toPdf } = require("./toPdf");
const { toInfographicImage } = require("./toInfographicImage");
const { storeGeneratedOutput } = require("../../services/objectStorage.service");

const formatOutput = async (type, content, owner = {}) => {
  let filename;
  switch (type) {
    case "presentation":
      filename = await toPptx(content);
      break;
      
    case "advisory":
    case "execSummary":
    case "threatIntel":
      filename = await toPdf(type, content);
      break;
      
    case "infographic":
      filename = await toInfographicImage(content);
      break;
      
    case "contractAudit":
    case "linkedin":
    case "twitter":
    case "videoPackage":
    default:
      filename = await toText(type, content);
  }

  return storeGeneratedOutput({ filename, ...owner });
};

module.exports = { formatOutput };
