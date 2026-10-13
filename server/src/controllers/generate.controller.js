const fs = require("fs/promises");
const asyncHandler = require("express-async-handler");
const Job = require("../models/Job");

const { preprocess } = require("../pipeline/preprocessing");
const { extractContext } = require("../pipeline/contextExtraction/extractContext");
const { runOrchestrator } = require("../pipeline/orchestrator/orchestrator");
const { validateOutput } = require("../pipeline/validator/validateOutput");
const { formatOutput } = require("../pipeline/formatter");
const { blockchainLedger } = require("../services/blockchainLedger.service");
const { saveSourceFile } = require("../services/objectStorage.service");

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

const isTruthy = (value) => value === true || value === "true" || value === "1";

const unlinkUploads = async (files) => {
    if (!files || files.length === 0) return;
    await Promise.all(files.map((f) => fs.unlink(f.path).catch(() => {})));
};

const generateContent = asyncHandler(async (req, res) => {
    const { sourceType, outputTypes, config } = req.body;
    const userId = req.userId || "anonymous_user";

    const parsedOutputTypes = parseIfNeeded(outputTypes);
    const parsedConfig = parseIfNeeded(config);
    const resumeJobId = req.body.jobId || null;
    const overrideClarification = isTruthy(req.body.overrideClarification);
    const clarificationAnswers = (req.body.clarificationAnswers || "").trim();

    let job;
    let sourceFilesSaved = false;

    const saveSourceFiles = async () => {
        if (sourceFilesSaved || !req.files?.length) return;
        const records = [];
        for (const file of req.files) {
            records.push(await saveSourceFile({ file, userId, jobId: job._id }));
        }
        job.sourceFiles.push(...records);
        await job.save();
        sourceFilesSaved = true;
    };

    try {
        if (resumeJobId) {
            job = await Job.findOne({ _id: resumeJobId, userId }).select("+processedSourceText");
            if (!job) {
                return res.status(404).json({ error: "Job not found", message: "Cannot resume this generation job." });
            }
            if (parsedConfig && Object.keys(parsedConfig).length > 0) {
                job.config = parsedConfig;
            }
            if (Array.isArray(parsedOutputTypes) && parsedOutputTypes.length > 0) {
                job.outputTypes = parsedOutputTypes;
            }
        } else {
            job = await Job.create({
                userId,
                sourceType: sourceType || "text",
                outputTypes: Array.isArray(parsedOutputTypes) ? parsedOutputTypes : [parsedOutputTypes],
                config: parsedConfig,
                status: "pending",
            });
        }

        const hasNewSource = (req.files && req.files.length > 0) || req.body.rawText || req.body.url;
        let cleanText = job.processedSourceText || null;

        if (hasNewSource || !cleanText) {
            const preprocessed = await preprocess({
                files: req.files || [],
                rawText: req.body.rawText || null,
                url: req.body.url || null,
                detailLevel: parsedConfig.detailLevel || job.config?.detailLevel,
            });

            if (!preprocessed || !preprocessed.cleanText) {
                throw new Error("Failed to extract readable content from the provided input.");
            }
            cleanText = preprocessed.cleanText;
        }

        await saveSourceFiles();

        if (clarificationAnswers) {
            cleanText = `${cleanText}\n\n--- Operator Clarification ---\n${clarificationAnswers}`;
        }

        const context = await extractContext(cleanText, {
            detailLevel: parsedConfig.detailLevel || job.config?.detailLevel,
        });

        const shouldAskClarification =
            context.needsClarification && !overrideClarification && !clarificationAnswers;

        if (shouldAskClarification) {
            job.context = context;
            job.processedSourceText = cleanText;
            job.status = "clarification_needed";
            job.clarification = {
                needed: true,
                question: context.clarificationQuestion,
                answers: undefined,
                proceededWithAvailableContext: false,
                askedAt: new Date(),
            };
            await job.save();

            return res.status(200).json({
                status: "clarification_needed",
                jobId: job._id,
                clarificationQuestion: context.clarificationQuestion,
                context,
            });
        }

        job.clarification = {
            needed: false,
            question: job.clarification?.question || context.clarificationQuestion || "",
            answers: clarificationAnswers || job.clarification?.answers,
            proceededWithAvailableContext: overrideClarification,
            askedAt: job.clarification?.askedAt,
            answeredAt: new Date(),
        };
        job.context = context;
        job.processedSourceText = cleanText;
        job.status = "processing";
        await job.save();

        const rawOutputs = await runOrchestrator(context, job.outputTypes, job.config);

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
                    const [validation, exportedFilePath] = await Promise.all([
                        validateOutput(raw.content, context),
                        formatOutput(raw.type, raw.content, { userId, jobId: job._id }),
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

        const proof = await blockchainLedger.sealAndPersistJob({
            jobId: job._id,
            sourceText: cleanText,
            outputs: finalOutputs,
            context,
            userId,
        });

        job.outputs = finalOutputs;
        job.sourceHash = proof.sourceHash;
        job.blockchainProof = {
            blockIndex: proof.blockIndex,
            blockHash: proof.blockHash,
            previousHash: proof.previousHash,
            merkleRoot: proof.merkleRoot,
            sealedAt: proof.sealedAt,
            verified: true,
        };
        // Retained privately so the original source hash can be independently verified later.
        job.processedSourceText = cleanText;
        job.status = "completed";
        await job.save();

        res.status(200).json(job);
    } catch (error) {
        if (job) {
            job.status = "failed";
            await job.save();
        }
        res.status(500).json({
            error: "Generation failed",
            message: error.message,
            jobId: job?._id,
        });
    } finally {
        await unlinkUploads(req.files);
    }
});

module.exports = { generateContent };
