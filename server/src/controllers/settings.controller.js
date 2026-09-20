const asyncHandler = require("express-async-handler");
const UserSettings = require("../models/UserSettings");

const getSettings = asyncHandler(async (req, res) => {
  const settings = await UserSettings.findOneAndUpdate(
    { userId: req.userId },
    { $setOnInsert: { userId: req.userId } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(settings);
});

const updateSettings = asyncHandler(async (req, res) => {
  const existing = await UserSettings.findOne({ userId: req.userId });
  const profile = { ...(existing?.profile?.toObject?.() || existing?.profile || {}), ...(req.body.profile || {}) };
  const defaults = { ...(existing?.defaults?.toObject?.() || existing?.defaults || {}), ...(req.body.defaults || {}) };
  const onboardingCompleted = typeof req.body.onboardingCompleted === "boolean"
    ? req.body.onboardingCompleted
    : existing?.onboardingCompleted || false;
  const settings = await UserSettings.findOneAndUpdate(
    { userId: req.userId },
    { $set: { onboardingCompleted, profile, defaults } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.json(settings);
});

module.exports = { getSettings, updateSettings };
