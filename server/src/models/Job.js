const mongoose = require("mongoose");

const OUTPUT_TYPES = [
    "linkedin",
    "twitter",
    "advisory",
    "execSummary",
    "presentation",
    "infographic",
    "videoPackage",
    "threatIntel",
    "contractAudit"
];

const configSchema = new mongoose.Schema(
    {
        tone: { type: String },
        audience: { type: String },
        language: { type: String, default: "en" },
        detailLevel: { type: String, enum: ["brief", "standard", "detailed"], default: "standard" },
        targetDuration: { type: String, enum: ["30s", "60-90s", "3-5 min"], default: "60-90s" },
        objective: { type: String },
    },
    { _id: false }
);

const contextSchema = new mongoose.Schema(
    {
        summary: { type: String },
        intent: { type: String },
        keyPoints: [{ type: String }],
        entities: [{ type: String }],
        cveIds: [{ type: String }],
        domain: { type: String },
        toneOfSource: { type: String },
        sourceCategory: { type: String },
        riskSeverity: {
            type: String,
            enum: ["Critical", "High", "Medium", "Low", "N/A"],
            default: "N/A"
        },
        needsClarification: { type: Boolean, default: false },
        clarificationQuestion: { type: String },
    },
    { _id: false }
);

const blockchainProofSchema = new mongoose.Schema(
    {
        blockIndex: { type: Number },
        blockHash: { type: String },
        previousHash: { type: String },
        merkleRoot: { type: String },
        sealedAt: { type: Date },
        verified: { type: Boolean, default: false },
    },
    { _id: false }
);

const clarificationSchema = new mongoose.Schema(
    {
        needed: { type: Boolean, default: false },
        question: { type: String },
        answers: { type: String },
        proceededWithAvailableContext: { type: Boolean, default: false },
        askedAt: { type: Date },
        answeredAt: { type: Date },
    },
    { _id: false }
);

const validationSchema = new mongoose.Schema(
    {
        passed: { type: Boolean, required: true },
        accuracyScore: { type: Number, min: 0, max: 100, default: 100 },
        issues: [{ type: String }],
        checkedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const outputSchema = new mongoose.Schema(
    {
        type: { type: String, enum: OUTPUT_TYPES, required: true },
        rawContent: { type: String },
        editedContent: { type: String },
        versions: [{
            content: { type: String, required: true },
            source: { type: String, enum: ["ai", "user", "ai_revision"], required: true },
            instruction: { type: String },
            createdAt: { type: Date, default: Date.now },
        }],
        validation: validationSchema,
        exportedFilePath: { type: String },
        status: { type: String, enum: ["success", "failed"], required: true },
        error: { type: String },
    },
    { _id: false }
);

const jobSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        sourceType: {
            type: String,
            enum: ["text", "pdf", "docx", "sol", "image", "audio", "video", "url"],
            required: true,
        },
        outputTypes: [{
            type: String,
            enum: OUTPUT_TYPES,
            required: true
        }],
        config: configSchema,
        status: {
            type: String,
            enum: ["pending", "processing", "clarification_needed", "completed", "failed"],
            default: "pending",
        },
        context: contextSchema,
        outputs: [outputSchema],
        blockchainProof: blockchainProofSchema,
        sourceHash: { type: String, select: false },
        clarification: clarificationSchema,
        processedSourceText: { type: String, select: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
module.exports.OUTPUT_TYPES = OUTPUT_TYPES;
