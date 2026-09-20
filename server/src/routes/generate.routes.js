const express = require("express");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const { requireAuthApi } = require("../middlewares/auth.middleware");
const generateController = require("../controllers/generate.controller");

const router = express.Router();

const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many generate requests. Try again after 15 minutes." },
});

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 5,
  },
});

router.post(
  "/generate",
  requireAuthApi,
  generateLimiter,
  (req, res, next) => {
    upload.array("files", 5)(req, res, (err) => {
      if (err) {
        const message = err.code === "LIMIT_FILE_SIZE"
          ? "Each file must be 50MB or smaller."
          : err.code === "LIMIT_FILE_COUNT"
            ? "A maximum of 5 files is allowed."
            : err.message;
        return res.status(400).json({ error: "Upload rejected", message });
      }
      next();
    });
  },
  generateController.generateContent
);

module.exports = router;
