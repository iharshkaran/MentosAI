const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const generateRoutes = require("./routes/generate.routes");
const { clerkMiddleware } = require("@clerk/express");

dotenv.config();

const app = express();

// Core middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware()); 


app.get("/api/download/:filename", (req, res) => {
    const filePath = path.join(__dirname, "../outputs", req.params.filename);
    res.download(filePath, (err) => {
        if (err) {
            res.status(404).json({ error: "File not found" });
        }
    });
});

app.use("/outputs", express.static(path.join(__dirname, "../outputs")));

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});



app.use("/api", generateRoutes);


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