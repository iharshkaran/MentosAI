const express = require("express");
const { blockchainLedger } = require("../services/blockchainLedger.service");
const Job = require("../models/Job");

const router = express.Router();

// GET /api/ledger/verify/:jobId - Cryptographically verifies any job in the blockchain ledger
router.get("/ledger/verify/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).lean();

    if (!job) {
      return res.status(404).json({ verified: false, error: "Job record not found" });
    }

    const verification = blockchainLedger.verifyJob(
      jobId,
      job.blockchainProof?.blockHash || null
    );

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
router.get("/ledger/chain", (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || "10", 10), 50);
  const blocks = blockchainLedger.getLatestBlocks(limit);
  res.status(200).json({
    totalBlocks: blockchainLedger.chain.length,
    blocks,
  });
});

module.exports = router;
