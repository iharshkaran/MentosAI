const { parsePdf } = require("./parsePdf");
const { parseDocx } = require("./parseDocx");
const { imageToText } = require("./imageToText");
const { transcribeAudio } = require("./transcribeAudio");
const { chunkAndSummarize } = require("./chunkAndSummarize");

const preprocess = async ({ sourceType, filePath, rawText }) => {
  let extractedText;

  switch (sourceType) {
    case "text":
    case "url":
      extractedText = rawText;
      break;
    case "pdf":
      extractedText = await parsePdf(filePath);
      break;
    case "docx":
      extractedText = await parseDocx(filePath);
      break;
    case "image":
      extractedText = await imageToText(filePath);
      break;
    case "audio":
    case "video":
      extractedText = await transcribeAudio(filePath);
      break;
    default:
      throw new Error(`Unsupported sourceType: ${sourceType}`);
  }

  // Large text chunking + map-reduce summarization (only kicks in if needed)
  const result = await chunkAndSummarize(extractedText);
  return result;
};

module.exports = { preprocess };