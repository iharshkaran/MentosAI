const fs = require("fs");
const { askClaudeWithImage } = require("../../services/llm.service");

const imageToText = async (filePath, mediaType = "image/jpeg") => {
  const base64Image = fs.readFileSync(filePath, { encoding: "base64" });
  const description = await askClaudeWithImage(
    base64Image,
    mediaType,
    "Describe this image in detail, including any text, data, or key visual information present. Be thorough and factual."
  );
  return description;
};

module.exports = { imageToText };