const asyncHandler = require("express-async-handler");
const Job = require("../models/Job");

const { preprocess } = require("../pipeline/preprocessing");
const { extractContext } = require("../pipeline/contextExtraction/extractContext");
const { runOrchestrator } = require("../pipeline/orchestrator/orchestrator");
const { validateOutput } = require("../pipeline/validator/validateOutput");
const { formatOutput } = require("../pipeline/formatter");

const generateContent = asyncHandler(async (req, res) => {
    const { sourceType, outputTypes, config } = req.body;
    const userId = req.userId;

    // Step 1: naya job banao — abhi "pending" state mein
    const job = await Job.create({
        userId,
        sourceType,
        outputTypes: JSON.parse(outputTypes), // form-data se aata hai string ke roop mein
        config: JSON.parse(config),
        status: "pending",
    });


    try {
        // Step 2: file/text ko clean text mein convert karo
        const preprocessed = await preprocess({
            // sourceType,
            // filePath: req.file ? req.file.path : null,
            // rawText: req.body.rawText || null,
            
            files: req.files,   // req.file (singular) NAHI — req.files (array)
            rawText: req.body.rawText || null,
            url: req.body.url || null,
        });


        // Step 3: LLM se context nikaalo
        const context = await extractContext(preprocessed.cleanText);

        job.context = context;
        job.status = "processing";
        await job.save();


        // Step 4: sab selected generators parallel chalao
        const rawOutputs = await runOrchestrator(context, job.outputTypes, job.config);


        // Step 5: har output ko validate + format karo (sirf agar generator succeed hua ho)
        const finalOutputs = [];
        for (const raw of rawOutputs) {
            if (raw.error || !raw.content) {
                finalOutputs.push({
                    type: raw.type,
                    rawContent: null,
                    validation: null,
                    exportedFilePath: null,
                    status: "failed",
                    error: raw.error || "Generator returned empty content",
                });
                continue; // validate/format skip karo is output ke liye
            }

            const validation = await validateOutput(raw.content, context);
            const exportedFilePath = await formatOutput(raw.type, raw.content);

            finalOutputs.push({
                type: raw.type,
                rawContent: raw.content,
                validation,
                exportedFilePath,
                status: "success",
                error: undefined,
            });
        }




        // Step 6: job ko final update do
        job.outputs = finalOutputs;
        job.status = "completed";
        await job.save();

        res.status(200).json(job);
    } catch (error) {
        job.status = "failed";
        await job.save();
        res.status(500).json({ error: "Generation failed", message: error.message });
    }
});

module.exports = { generateContent };