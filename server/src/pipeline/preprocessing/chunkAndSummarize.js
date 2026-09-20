const { askClaude } = require("../../services/llm.service");

const CHUNK_SIZE = 12000; // characters, roughly ~3000 tokens
const THRESHOLD = 24000; // only chunk if text is longer than this
const LARGE_DOC_CHARS = 50000;

const splitIntoChunks = (text) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
  }
  return chunks;
};

const summarizeChunk = async (chunk, { dense }) => {
  const prompt = dense
    ? `Summarize the key points, facts, technical details, IOCs, CVE references, and important findings from this section in 350-500 words. Preserve names, systems, and numbers. Do not pad with filler:\n\n${chunk}`
    : `Summarize the key points, facts, and important details from this section in 150-200 words:\n\n${chunk}`;
  return askClaude(prompt, dense ? 900 : 400);
};

const chunkAndSummarize = async (text, { detailLevel } = {}) => {
  if (text.length <= THRESHOLD) {
    return { cleanText: text, wasChunked: false };
  }

  const dense =
    detailLevel === "detailed" || text.length > LARGE_DOC_CHARS;

  const chunks = splitIntoChunks(text);
  const summaries = await Promise.all(chunks.map((chunk) => summarizeChunk(chunk, { dense })));
  const combined = summaries.join("\n\n");

  return { cleanText: combined, wasChunked: true, originalTokenCount: text.length, denseSummaries: dense };
};

module.exports = { chunkAndSummarize };
