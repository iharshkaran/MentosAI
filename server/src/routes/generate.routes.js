const express = require("express");
const { requireAuthApi } = require("../middlewares/auth.middleware");
const multer = require("multer");
const generateController = require("../controllers/generate.controller");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/generate",
  requireAuthApi,
  upload.array("files", 5),
  generateController.generateContent
);

module.exports = router;