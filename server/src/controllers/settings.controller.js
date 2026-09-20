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
  const profile = req.body.profile || {};
  const defaults = req.body.defaults || {};
  const settings = await UserSettings.findOneAndUpdate(
    { userId: req.userId },
    { $set: { onboardingCompleted: Boolean(req.body.onboardingCompleted), profile, defaults } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.json(settings);
});

module.exports = { getSettings, updateSettings };
