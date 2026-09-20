const express = require("express");
const { requireAuthApi } = require("../middlewares/auth.middleware");
const { blockchainLedger, sha256 } = require("../services/blockchainLedger.service");
const Job = require("../models/Job");

const router = express.Router();

// GET /api/ledger/verify/:jobId - Cryptographically verifies any job in the blockchain ledger
router.get("/ledger/verify/:jobId", requireAuthApi, async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findOne({ _id: jobId, userId: req.userId })
      .select("+sourceHash +processedSourceText")
      .lean();

    if (!job) {
      return res.status(404).json({ verified: false, error: "Job record not found" });
    }

    const verification = blockchainLedger.verifyJob(
      jobId,
      job.blockchainProof?.blockHash || null
    );

    if (verification.verified) {
      const currentOutputsHash = sha256(job.outputs.map((output) => ({ type: output.type, content: output.rawContent })));
      if (currentOutputsHash !== verification.block.outputsHash) {
        verification.verified = false;
        verification.tampered = true;
        verification.error = "Generated output no longer matches its sealed hash.";
      } else if (!job.processedSourceText) {
        verification.sourceVerification = "unavailable_for_legacy_job";
      } else if (sha256(job.processedSourceText) !== verification.block.sourceHash) {
        verification.verified = false;
        verification.tampered = true;
        verification.error = "Original source no longer matches its sealed hash.";
      }
    }

    // Jobs created before persistent ledger support retained only an in-memory block.
    // They cannot be truthfully verified after a server restart.
    if (!verification.verified && job.blockchainProof && verification.error === "Job hash not found in cryptographic blockchain ledger") {
      return res.status(200).json({
        jobId,
        verified: false,
        legacyProof: true,
        error: "This job was created before persistent ledger support. Generate it again to create a verifiable seal.",
        storedProof: job.blockchainProof,
      });
    }

    res.status(200).json({
      jobId,
      ...verification,
      storedProof: job.blockchainProof || null,
    });
  } catch (err) {
    res.status(500).json({ verified: false, error: err.message });
  }
});

// GET /api/ledger/chain - Returns recent blocks in the immutable chain
router.get("/ledger/chain", requireAuthApi, (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || "10", 10), 50);
  const blocks = blockchainLedger.getLatestBlocks(limit, req.userId);
  res.status(200).json({
    totalBlocks: blocks.length,
    blocks,
  });
});

module.exports = router;
