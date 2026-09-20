const mongoose = require("mongoose");

const ledgerBlockSchema = new mongoose.Schema(
  {
    index: { type: Number, required: true, unique: true },
    hashVersion: { type: Number, default: 2 },
    timestamp: { type: String, required: true },
    previousHash: { type: String, required: true },
    jobId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    sourceHash: { type: String, required: true },
    outputsHash: { type: String, required: true },
    validatorScore: { type: Number, required: true },
    cveReferences: [{ type: String }],
    domain: { type: String, required: true },
    merkleRoot: { type: String, required: true },
    blockHash: { type: String, required: true, unique: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("LedgerBlock", ledgerBlockSchema);
