const { toText } = require("./toText");

const TEXT_TYPES = ["linkedin", "twitter"]; // ye simple text hain
// presentation -> toPptx, advisory/execSummary -> toPdf (baad mein add honge)

const formatOutput = async (type, content) => {
  if (TEXT_TYPES.includes(type)) {
    return toText(type, content);
  }
  // Fallback: jab tak specific formatter na bane, text hi save karo
  return toText(type, content);
};

module.exports = { formatOutput };