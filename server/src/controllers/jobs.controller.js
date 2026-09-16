const asyncHandler = require("express-async-handler");
const { getAuth } = require("@clerk/express");
const { reverificationErrorResponse } = require("@clerk/shared/authorization-errors");
const Job = require("../models/Job");

const listJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .select("sourceType outputTypes status createdAt updatedAt")
    .lean();

  res.status(200).json(jobs);
});

const getJobById = asyncHandler(async (req, res) => {
  const auth = getAuth(req);
  const isReverified = auth.has({ reverification: "strict" });

  if (!isReverified) {
    // Clerk ka official response object use karo — exact shape guaranteed
    const clerkResponse = reverificationErrorResponse("strict");
    const body = await clerkResponse.json();
    return res.status(clerkResponse.status).json(body);
  }

  const job = await Job.findOne({ _id: req.params.id, userId: req.userId });
  if (!job) {
    return res.status(404).json({ error: "Not found" });
  }

  res.status(200).json(job);
});

module.exports = { listJobs, getJobById };