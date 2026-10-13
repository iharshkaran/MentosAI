const express = require("express");
const { requireAuthApi } = require("../middlewares/auth.middleware");
const { listJobs, getJobById, saveOutputEdit, reviseOutput, downloadOutput, downloadSourceFile } = require("../controllers/jobs.controller");

const router = express.Router();

router.get("/jobs", requireAuthApi, listJobs);
router.get("/jobs/:id", requireAuthApi, getJobById);
router.put("/jobs/:id/outputs/:type", requireAuthApi, saveOutputEdit);
router.post("/jobs/:id/outputs/:type/revise", requireAuthApi, reviseOutput);
router.get("/jobs/:id/outputs/:type/download", requireAuthApi, downloadOutput);
router.get("/jobs/:id/source-files/:fileId/download", requireAuthApi, downloadSourceFile);

module.exports = router;
