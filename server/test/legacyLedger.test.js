const test = require("node:test");
const assert = require("node:assert/strict");
const { CryptographicBlockchainLedger } = require("../src/services/blockchainLedger.service");

test("verifies new blocks after a legacy genesis block", () => {
  const ledger = new CryptographicBlockchainLedger();
  const legacyGenesis = ledger.chain[0];
  legacyGenesis.hashVersion = undefined;
  legacyGenesis.blockHash = ledger.computeLegacyBlockHash(legacyGenesis);
  const proof = ledger.sealJob({ jobId: "new-job", userId: "user-1" });

  assert.equal(ledger.verifyJob("new-job", proof.blockHash).verified, true);
});
