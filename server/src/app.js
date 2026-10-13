const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const generateRoutes = require("./routes/generate.routes");
const { clerkMiddleware } = require("@clerk/express");
const jobsRoutes = require("./routes/jobs.routes");
const ledgerRoutes = require("./routes/ledger.routes");
const settingsRoutes = require("./routes/settings.routes");

const app = express();

const configuredOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// Core middlewares
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || configuredOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Origin is not allowed by CORS"));
    },
}));
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
    if (err.message === "Origin is not allowed by CORS") {
        return res.status(403).json({ error: "Origin is not allowed" });
    }
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong", message: err.message });
});

module.exports = app;
