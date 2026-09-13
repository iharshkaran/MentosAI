const mongoose = require("mongoose");

const OUTPUT_TYPES = [
    "linkedin",
    "twitter",
    "advisory",
    "execSummary",
    "presentation",
    "infographic",
    "videoPackage",
];

const configSchema = new mongoose.Schema(
    {
        tone: { type: String },
        audience: { type: String },
        language: { type: String },
        detailLevel: { type: String, enum: ["brief", "standard", "detailed"] },
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
        domain: { type: String },
        toneOfSource: { type: String },
    },
    { _id: false }
);

const validationSchema = new mongoose.Schema(
    {
        passed: { type: Boolean, required: true },
        issues: [{ type: String }],
        checkedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const outputSchema = new mongoose.Schema(
    {
        type: { type: String, enum: OUTPUT_TYPES, required: true },
        rawContent: { type: String },
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
            enum: ["text", "pdf", "docx", "image", "audio", "video", "url"],
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
            enum: ["pending", "processing", "completed", "failed"],
            default: "pending",
        },
        context: contextSchema,
        outputs: [outputSchema],
    },
    { timestamps: true } // auto-adds createdAt & updatedAt
);

module.exports = mongoose.model("Job", jobSchema);
module.exports.OUTPUT_TYPES = OUTPUT_TYPES;