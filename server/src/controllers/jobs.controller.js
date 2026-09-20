const asyncHandler = require("express-async-handler");
const { getAuth } = require("@clerk/express");
const { reverificationErrorResponse } = require("@clerk/shared/authorization-errors");
const Job = require("../models/Job");
const { askClaude } = require("../services/llm.service");
const { formatOutput } = require("../pipeline/formatter");

const findOwnedOutput = async (req) => {
  let job = null;
  try {
    job = await Job.findOne({ _id: req.params.id, userId: req.userId });
  } catch (err) {
    return { job: null, output: null };
  }
  const output = job?.outputs?.find((item) => item.type === req.params.type);
  if (!job || !output) return { job: null, output: null };
  return { job, output };
};

const listJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .select("sourceType outputTypes status createdAt updatedAt")
    .lean();

  res.status(200).json(jobs);
});

const getJobById = asyncHandler(async (req, res) => {
  const auth = getAuth(req);

  // If strict reverification is enabled via env or explicit header
  if ((process.env.STRICT_REVERIFICATION === "true" || req.headers["x-strict-reverification"] === "true") && auth?.has && typeof auth.has === "function") {
    const isReverified = auth.has({ reverification: "strict" });

    if (!isReverified) {
      const clerkResponse = reverificationErrorResponse("strict");
      const body = await clerkResponse.json();
      return res.status(clerkResponse.status).json(body);
    }
  }

  const job = await Job.findOne({ _id: req.params.id, userId: req.userId });
  if (!job) {
    return res.status(404).json({ error: "Not found" });
  }

  res.status(200).json(job);
});

const saveOutputEdit = asyncHandler(async (req, res) => {
  const content = String(req.body.content || "").trim();
  if (!content) return res.status(400).json({ error: "Edited content is required" });

  const { job, output } = await findOwnedOutput(req);
  if (!job || !output) return res.status(404).json({ error: "Output not found" });

  output.editedContent = content;
  output.exportedFilePath = await formatOutput(output.type, content);
  if (!Array.isArray(output.versions)) {
    output.versions = [];
  }
  output.versions.push({ content, source: "user" });
  await job.save();
  res.json({ output });
});

const reviseOutput = asyncHandler(async (req, res) => {
  const instruction = String(req.body.instruction || "").trim();
  if (!instruction) return res.status(400).json({ error: "An edit instruction is required" });

  const { job, output } = await findOwnedOutput(req);
  if (!job || !output) return res.status(404).json({ error: "Output not found" });

  const currentContent = output.editedContent || output.rawContent || "";
  const context = job.context || {};
  const revisedContent = await askClaude(`
You are editing an existing ${output.type} artifact.
User instruction: ${instruction}
Current artifact:\n${currentContent}

Verified source facts (use only these facts; do not invent missing details):
Summary: ${context.summary || ""}
Key points: ${(context.keyPoints || []).join("; ")}
Entities: ${(context.entities || []).join(", ")}
CVE IDs: ${(context.cveIds || []).join(", ")}

Return only the complete revised artifact, ready to use.`, 2048);

  output.editedContent = revisedContent;
  output.exportedFilePath = await formatOutput(output.type, revisedContent);
  if (!Array.isArray(output.versions)) {
    output.versions = [];
  }
  output.versions.push({ content: revisedContent, source: "ai_revision", instruction });
  await job.save();
  res.json({ output });
});

const downloadOutput = asyncHandler(async (req, res) => {
  const { job, output } = await findOwnedOutput(req);
  if (!job || !output?.exportedFilePath) return res.status(404).json({ error: "Download not found" });
  const path = require("path");
  const filePath = path.join(__dirname, "../../outputs", path.basename(output.exportedFilePath));
  return res.download(filePath);
});

module.exports = { listJobs, getJobById, saveOutputEdit, reviseOutput, downloadOutput };
