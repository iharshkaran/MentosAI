const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const generateRoutes = require("./routes/generate.routes");
const { clerkMiddleware } = require("@clerk/express");
const jobsRoutes = require("./routes/jobs.routes");
const ledgerRoutes = require("./routes/ledger.routes");
const settingsRoutes = require("./routes/settings.routes");

dotenv.config();

const app = express();

// Core middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware()); 

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});


// Routes
app.use("/api", generateRoutes);
app.use("/api", jobsRoutes);
app.use("/api", ledgerRoutes);
app.use("/api", settingsRoutes);


// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong", message: err.message });
});

module.exports = app;
