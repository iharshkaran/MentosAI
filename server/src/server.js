const app = require("./app");
const connectDB = require("./config/db");
const { blockchainLedger } = require("./services/blockchainLedger.service");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await blockchainLedger.initialize();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
