const express = require("express");
const { requireAuthApi } = require("../middlewares/auth.middleware");
const { listJobs, getJobById } = require("../controllers/jobs.controller");

const router = express.Router();

router.get("/jobs", requireAuthApi, listJobs);
router.get("/jobs/:id", requireAuthApi, getJobById);

module.exports = router;