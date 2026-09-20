const express = require("express");
const { requireAuthApi } = require("../middlewares/auth.middleware");
const { getSettings, updateSettings } = require("../controllers/settings.controller");

const router = express.Router();
router.get("/settings", requireAuthApi, getSettings);
router.put("/settings", requireAuthApi, updateSettings);
module.exports = router;
