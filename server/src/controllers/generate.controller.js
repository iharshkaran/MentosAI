const asyncHandler = require("express-async-handler");
const Job = require("../models/Job");

const { preprocess } = require("../pipeline/preprocessing");
const { extractContext } = require("../pipeline/contextExtraction/extractContext");
const { runOrchestrator } = require("../pipeline/orchestrator/orchestrator");
const { validateOutput } = require("../pipeline/validator/validateOutput");
const { formatOutput } = require("../pipeline/formatter");

// Safe JSON Parsing Helper
const parseIfNeeded = (data) => {
    if (!data) return {};
    if (typeof data === "string") {
        try {
            return JSON.parse(data);
        } catch (e) {
            return {};
        }
    }
    return data;
};

const generateContent = asyncHandler(async (req, res) => {
    const { sourceType, outputTypes, config } = req.body;
    const userId = req.userId || "anonymous_user";

    const parsedOutputTypes = parseIfNeeded(outputTypes);
    const parsedConfig = parseIfNeeded(config);

    // Step 1: Naya Job Create Karo - "pending" state mein
    const job = await Job.create({
        userId,
        sourceType: sourceType || "text",
        outputTypes: Array.isArray(parsedOutputTypes) ? parsedOutputTypes : [parsedOutputTypes],
        config: parsedConfig,
        status: "pending",
    });

    try {
        // Step 2: Multi-Modal file/text ko clean text mein extract & normalize karo
        const preprocessed = await preprocess({
            files: req.files || [],
            rawText: req.body.rawText || null,
            url: req.body.url || null,
        });

        if (!preprocessed || !preprocessed.cleanText) {
            throw new Error("Failed to extract readable content from the provided input.");
        }

        // Step 3: LLM se Security & Technical Context Extract karo
        const context = await extractContext(preprocessed.cleanText);

        job.context = context;
        job.status = "processing";
        await job.save();

        // Step 4: Sabhi selected generators parallel chalao
        const rawOutputs = await runOrchestrator(context, job.outputTypes, job.config);

        // Step 5: Parallel Validation & Formatting Engine (High Performance)
        const finalOutputs = await Promise.all(
            rawOutputs.map(async (raw) => {
                if (raw.error || !raw.content) {
                    return {
                        type: raw.type,
                        rawContent: null,
                        validation: null,
                        exportedFilePath: null,
                        status: "failed",
                        error: raw.error || "Generator returned empty content",
                    };
                }

                try {
                    // Anti-Hallucination Guardrail Check & File Export parallel run
                    const [validation, exportedFilePath] = await Promise.all([
                        validateOutput(raw.content, context),
                        formatOutput(raw.type, raw.content),
                    ]);

                    return {
                        type: raw.type,
                        rawContent: raw.content,
                        validation,
                        exportedFilePath,
                        status: "success",
                        error: undefined,
                    };
                } catch (formatErr) {
                    return {
                        type: raw.type,
                        rawContent: raw.content,
                        validation: null,
                        exportedFilePath: null,
                        status: "failed",
                        error: `Formatting/Validation failed: ${formatErr.message}`,
                    };
                }
            })
        );

        // Step 6: Job Finalize Update
        job.outputs = finalOutputs;
        job.status = "completed";
        await job.save();

        res.status(200).json(job);
    } catch (error) {
        job.status = "failed";
        await job.save();
        res.status(500).json({
            error: "Generation failed",
            message: error.message,
            jobId: job._id
        });
    }
});

module.exports = { generateContent };