const app = require("./app");
const connectDB = require("./config/db");
const { blockchainLedger } = require("./services/blockchainLedger.service");

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await blockchainLedger.initialize();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
