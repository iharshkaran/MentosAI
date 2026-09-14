const path = require("path");
const { parseOfficeFile } = require("./parseOfficeFile");
const { imageToText } = require("./imageToText");
const { transcribeMedia } = require("./transcribeMedia");
const { parseGeneric } = require("./parseGeneric");
const { extractFromUrl } = require("./extractFromUrl");
const { chunkAndSummarize } = require("./chunkAndSummarize");

const OFFICE_EXT = [".pdf", ".docx", ".pptx", ".xlsx", ".odt", ".odp", ".ods", ".rtf", ".csv", ".md", ".epub", ".html", ".htm"];
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const AV_EXT = [".mp3", ".wav", ".m4a", ".mp4", ".mov", ".webm"];
const URL_ONLY_REGEX = /^https?:\/\/\S+$/i;

const extractSingleFile = async (file) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (OFFICE_EXT.includes(ext)) return parseOfficeFile(file.path, ext);
  if (IMAGE_EXT.includes(ext)) return imageToText(file.path);
  if (AV_EXT.includes(ext)) return transcribeMedia(file.path, ext);

  return parseGeneric(file.path);
};

const preprocess = async ({ files, rawText, url }) => {
  const sections = [];
  let resolvedUrl = url;
  let resolvedText = rawText;

  // Agar rawText khud ek bare URL hai (jaisa YouTube link paste karne pe hota hai),
  // usse "url" ki tarah treat karo, plain text ki tarah nahi
  if (resolvedText && URL_ONLY_REGEX.test(resolvedText.trim()) && !resolvedUrl) {
    resolvedUrl = resolvedText.trim();
    resolvedText = null;
  }

  if (files && files.length > 0) {
    const extractedTexts = await Promise.all(
      files.map(async (file) => {
        const text = await extractSingleFile(file);
        return `--- Source: ${file.originalname} ---\n${text}`;
      })
    );
    sections.push(...extractedTexts);
  }

  if (resolvedText) {
    sections.push(`--- Source: pasted text ---\n${resolvedText}`);
  }

  if (resolvedUrl) {
    const urlText = await extractFromUrl(resolvedUrl);
    sections.push(`--- Source: ${resolvedUrl} ---\n${urlText}`);
  }

  if (sections.length === 0) {
    throw new Error("No source content provided");
  }

  const combinedText = sections.join("\n\n");
  return chunkAndSummarize(combinedText);
};

module.exports = { preprocess };