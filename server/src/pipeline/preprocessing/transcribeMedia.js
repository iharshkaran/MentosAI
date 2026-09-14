const fs = require("fs");
const { askClaudeWithFile } = require("../../services/llm.service");

const MIME_TYPES = {
    ".mp3": "audio/mp3",
    ".wav": "audio/wav",
    ".m4a": "audio/mp4",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".webm": "video/webm",
};

const transcribeMedia = async (filePath, ext) => {
    const base64Data = fs.readFileSync(filePath, { encoding: "base64" });
    const mimeType = MIME_TYPES[ext] || "audio/mp3";

    const prompt = mimeType.startsWith("video")
        ? "Transcribe and describe this video in detail — include spoken content, key visuals, and overall narrative. Be thorough and factual."
        : "Transcribe this audio accurately. Include speaker changes if identifiable.";

    return askClaudeWithFile(filePath, mimeType, prompt);
};

module.exports = { transcribeMedia };