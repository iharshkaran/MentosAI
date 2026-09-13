const express = require("express");
// const { requireAuth } = require("@clerk/express");
const multer = require("multer");
const generateController = require("../controllers/generate.controller");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/generate",
//   requireAuth(),
  upload.single("file"),
  generateController.generateContent
);

module.exports = router;