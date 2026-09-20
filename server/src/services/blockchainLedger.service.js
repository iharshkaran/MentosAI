const crypto = require("crypto");
const LedgerBlock = require("../models/LedgerBlock");

/**
 * Node.js Native Cryptographic Blockchain Audit Ledger
 * Purpose-built for NTRO Chain-of-Custody & Anti-Tamper Verification
 */

const sha256 = (data) => {
  const content = typeof data === "object" ? JSON.stringify(data) : String(data);
  return crypto.createHash("sha256").update(content).digest("hex");
};

class CryptographicBlockchainLedger {
  constructor() {
    this.chain = [];
    // Keep writes in order inside this Node process. MongoDB is still the
    // source of truth, so we also refresh before every seal.
    this.writeQueue = Promise.resolve();
    this.initializeGenesisBlock();
  }

  initializeGenesisBlock() {
    const genesisBlock = {
      index: 0,
      hashVersion: 2,
      timestamp: new Date("2026-01-01T00:00:00.000Z").toISOString(),
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
      jobId: "GENESIS_BLOCK_NTRO_CYBER_VAULT",
      sourceHash: "0000000000000000000000000000000000000000000000000000000000000000",
      outputsHash: "0000000000000000000000000000000000000000000000000000000000000000",
      validatorScore: 100,
      cveReferences: [],
      domain: "genesis",
      userId: "SYSTEM_INITIALIZER",
      merkleRoot: "0000000000000000000000000000000000000000000000000000000000000000",
    };

    genesisBlock.blockHash = this.computeBlockHash(genesisBlock);
    this.chain.push(genesisBlock);
  }

  computeBlockHash(block) {
    const payload = [
      block.index,
      block.timestamp,
      block.previousHash,
      block.jobId,
      block.sourceHash,
      block.outputsHash,
      block.validatorScore,
      (block.cveReferences || []).sort().join(","),
      block.domain,
      block.userId,
      block.merkleRoot,
    ].join("|");

    return sha256(payload);
  }

  computeLegacyBlockHash(block) {
    const payload = [block.index, block.timestamp, block.previousHash, block.jobId,
      block.sourceHash, block.outputsHash, block.validatorScore,
      (block.cveReferences || []).sort().join(","), block.userId, block.merkleRoot].join("|");
    return sha256(payload);
  }

  isBlockHashValid(block) {
    return this.computeBlockHash(block) === block.blockHash ||
      (!block.hashVersion && this.computeLegacyBlockHash(block) === block.blockHash);
  }

  /**
   * Cryptographically seals an intelligence transformation job into the ledger
   */
  sealJob({ jobId, sourceText = "", outputs = [], context = {}, userId = "anonymous" }) {
    const previousBlock = this.chain[this.chain.length - 1];

    const sourceHash = sha256(sourceText);
    const outputsHash = sha256(outputs.map((o) => ({ type: o.type, content: o.rawContent })));
    const merkleRoot = sha256(`${sourceHash}:${outputsHash}:${JSON.stringify(context.cveIds || [])}`);

    // Compute average validation score
    const validScores = outputs
      .filter((o) => o.validation && typeof o.validation.accuracyScore === "number")
      .map((o) => o.validation.accuracyScore);
    const avgValidatorScore = validScores.length
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : 95;

    const block = {
      index: this.chain.length,
      hashVersion: 2,
      timestamp: new Date().toISOString(),
      previousHash: previousBlock.blockHash,
      jobId: String(jobId),
      sourceHash,
      outputsHash,
      validatorScore: avgValidatorScore,
      cveReferences: context.cveIds || [],
      domain: context.domain || "cybersecurity",
      userId,
      merkleRoot,
    };

    block.blockHash = this.computeBlockHash(block);
    this.chain.push(block);

    return {
      blockIndex: block.index,
      blockHash: block.blockHash,
      previousHash: block.previousHash,
      sourceHash: block.sourceHash,
      merkleRoot: block.merkleRoot,
      sealedAt: block.timestamp,
      verified: true,
      chainLength: this.chain.length,
    };
  }

  async initialize() {
    const persistedBlocks = await LedgerBlock.find().sort({ index: 1 }).lean();
    if (persistedBlocks.length > 0) {
      this.chain = persistedBlocks.map(({ _id, ...block }) => block);
      return;
    }

    // A developer may clear MongoDB while this server is still running. In
    // that case, the in-memory chain is stale and must not be used to create
    // the first block of the new ledger.
    this.chain = [];
    this.initializeGenesisBlock();

    try {
      await LedgerBlock.create(this.chain[0]);
    } catch (error) {
      // Another request/process may have created the genesis block between
      // the read above and this insert. Reload it instead of failing.
      if (error?.code !== 11000) throw error;
      const blocks = await LedgerBlock.find().sort({ index: 1 }).lean();
      this.chain = blocks.map(({ _id, ...block }) => block);
    }
  }

  async persistBlock() {
    const block = this.chain[this.chain.length - 1];
    await LedgerBlock.create(block);
  }

  /**
   * Creates and saves a block as one operation.
   *
   * Reloading from MongoDB prevents a restarted server (or a previously
   * failed request) from reusing an old in-memory block number. A duplicate
   * index is retried after a fresh reload to also handle overlapping requests.
   */
  async sealAndPersistJob(jobData) {
    const work = async () => {
      let lastError;

      for (let attempt = 0; attempt < 3; attempt += 1) {
        await this.initialize();
        const proof = this.sealJob(jobData);
        const block = this.chain[this.chain.length - 1];

        try {
          await LedgerBlock.create(block);
          return proof;
        } catch (error) {
          lastError = error;
          // Discard the unsaved local block. The next attempt reloads the
          // canonical chain and receives the next available index.
          this.chain.pop();
          if (error?.code !== 11000) throw error;
        }
      }

      throw lastError;
    };

    const result = this.writeQueue.then(work, work);
    // Do not leave the queue permanently rejected after one failed job.
    this.writeQueue = result.catch(() => undefined);
    return result;
  }

  /**
   * Cryptographically verifies a block by index and expected hash
   */
  verifyBlock(blockIndex, blockHash) {
    const index = Number(blockIndex);
    if (!Number.isInteger(index) || index < 0 || index >= this.chain.length) {
      return {
        verified: false,
        error: "Block index not found in cryptographic blockchain ledger",
      };
    }

    const block = this.chain[index];
    if (!this.isBlockHashValid(block)) {
      return {
        verified: false,
        tampered: true,
        error: "Block payload has been tampered with; hash mismatch detected!",
      };
    }

    if (blockHash && block.blockHash !== blockHash) {
      return {
        verified: false,
        tampered: true,
        error: "Expected block hash does not match ledger record",
      };
    }

    if (index > 0) {
      const prevBlock = this.chain[index - 1];
      if (block.previousHash !== prevBlock.blockHash) {
        return {
          verified: false,
          tampered: true,
          error: "Blockchain linkage broken; previous hash does not match predecessor!",
        };
      }
    }

    return {
      verified: true,
      block,
      chainLength: this.chain.length,
      chainIntegrity: "100% (Cryptographically Sealed)",
    };
  }

  /**
   * Verifies a specific block and validates entire chain integrity up to that block
   */
  verifyJob(jobId, expectedBlockHash = null) {
    const blockIndex = this.chain.findIndex((b) => b.jobId === String(jobId));
    if (blockIndex === -1) {
      return {
        verified: false,
        error: "Job hash not found in cryptographic blockchain ledger",
      };
    }

    const block = this.chain[blockIndex];

    // 1. Verify every earlier block and its predecessor link, not only the target block.
    for (let index = 0; index <= blockIndex; index += 1) {
      const candidate = this.chain[index];
      if (!this.isBlockHashValid(candidate)) {
        return {
          verified: false,
          tampered: true,
          error: `Block ${index} payload has been tampered with; hash mismatch detected!`,
        };
      }
      if (index > 0 && candidate.previousHash !== this.chain[index - 1].blockHash) {
        return {
          verified: false,
          tampered: true,
          error: `Blockchain linkage broken before block ${index}!`,
        };
      }
    }

    // 2. If expectedBlockHash provided, verify match
    if (expectedBlockHash && block.blockHash !== expectedBlockHash) {
      return {
        verified: false,
        tampered: true,
        error: "Expected block hash does not match ledger record",
      };
    }

    return {
      verified: true,
      block,
      chainLength: this.chain.length,
      chainIntegrity: "100% (Cryptographically Sealed)",
    };
  }

  getLatestBlocks(limit = 10, userId) {
    const visibleBlocks = userId
      ? this.chain.filter((block) => block.userId === userId)
      : this.chain;
    return visibleBlocks.slice(-limit).reverse();
  }
}

// Singleton instance
const blockchainLedger = new CryptographicBlockchainLedger();

module.exports = { CryptographicBlockchainLedger, blockchainLedger, sha256 };
