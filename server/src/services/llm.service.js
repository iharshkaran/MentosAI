const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenAI, createUserContent, createPartFromUri } = require("@google/genai");

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = "gemini-3.5-flash-lite";

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

const askClaudeWithMedia = async (base64Data, mimeType, prompt) => {
    const response = await client.models.generateContent({
        model: MODEL,
        contents: [
            { text: prompt },
            { inlineData: { mimeType, data: base64Data } },
        ],
    });
    return response.text;
};

// Audio/video ke liye — File API use karta hai (bade files ke liye reliable)
const askClaudeWithFile = async (filePath, mimeType, prompt) => {
    const uploadedFile = await client.files.upload({
        file: filePath,
        config: { mimeType },
    });

    const response = await client.models.generateContent({
        model: MODEL,
        contents: createUserContent([
            createPartFromUri(uploadedFile.uri, uploadedFile.mimeType),
            prompt,
        ]),
    });

    return response.text;
};

module.exports = { askClaude, askClaudeWithImage, askClaudeWithMedia, askClaudeWithFile };