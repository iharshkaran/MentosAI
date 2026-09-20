const test = require("node:test");
const assert = require("node:assert/strict");
const { CryptographicBlockchainLedger } = require("../src/services/blockchainLedger.service");

test("seals a job and verifies its hash chain", () => {
  const ledger = new CryptographicBlockchainLedger();
  const proof = ledger.sealJob({
    jobId: "job-123",
    sourceText: "Security advisory source text",
    outputs: [{ type: "advisory", rawContent: "Generated advisory", validation: { accuracyScore: 97 } }],
    context: { cveIds: ["CVE-2026-1234"], domain: "cybersecurity" },
    userId: "user-123",
  });

  assert.equal(proof.verified, true);
  assert.equal(ledger.verifyJob("job-123", proof.blockHash).verified, true);
  assert.equal(ledger.getLatestBlocks(10, "user-123").length, 1);
});

test("detects a tampered ledger block", () => {
  const ledger = new CryptographicBlockchainLedger();
  const proof = ledger.sealJob({ jobId: "job-456", userId: "user-456" });
  ledger.chain[proof.blockIndex].domain = "tampered";

  assert.equal(ledger.verifyJob("job-456").verified, false);
});
