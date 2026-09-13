const { askClaude } = require("../../services/llm.service");

const CHUNK_SIZE = 12000; // characters, roughly ~3000 tokens
const THRESHOLD = 24000; // only chunk if text is longer than this

const splitIntoChunks = (text) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
  }
  return chunks;
};

const summarizeChunk = async (chunk) => {
  const prompt = `Summarize the key points, facts, and important details from this section in 150-200 words:\n\n${chunk}`;
  return askClaude(prompt, 400);
};

const chunkAndSummarize = async (text) => {
  if (text.length <= THRESHOLD) {
    return { cleanText: text, wasChunked: false };
  }

  const chunks = splitIntoChunks(text);
  const summaries = await Promise.all(chunks.map(summarizeChunk));
  const combined = summaries.join("\n\n");

  return { cleanText: combined, wasChunked: true, originalTokenCount: text.length };
};

module.exports = { chunkAndSummarize };