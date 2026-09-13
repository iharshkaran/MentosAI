// NOTE: Requires OpenAI Whisper API (separate from Anthropic).
// Lower priority — implement only if time permits after core pipeline works.
// Needs: npm install openai, and OPENAI_API_KEY in .env

const transcribeAudio = async (filePath) => {
  throw new Error("Audio/video transcription not yet implemented");
};

module.exports = { transcribeAudio };