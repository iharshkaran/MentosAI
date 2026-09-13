const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = "gemini-3.8-flash";

const askClaude = async (prompt, maxTokens = 1024) => {
    const response = await client.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: { maxOutputTokens: maxTokens },
    });
    return response.text;
};


const askClaudeWithImage = async (base64Image, mediaType, prompt) => {
    const response = await client.models.generateContent({
        model: MODEL,
        contents: [
            { text: prompt },
            { inlineData: { mimeType: mediaType, data: base64Image } },
        ],
    });
    return response.text;
};

module.exports = { askClaude, askClaudeWithImage };