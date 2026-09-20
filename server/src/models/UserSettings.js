const mongoose = require("mongoose");

const userSettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  onboardingCompleted: { type: Boolean, default: false },
  profile: {
    role: { type: String, default: "" },
    organizationName: { type: String, default: "" },
    primaryAudience: { type: String, default: "" },
  },
  defaults: {
    tone: { type: String, default: "professional" },
    language: { type: String, default: "en" },
    detailLevel: { type: String, default: "standard" },
    targetDuration: { type: String, enum: ["30s", "60-90s", "3-5 min"], default: "60-90s" },
    strictSourceGrounding: { type: Boolean, default: true },
  },
}, { timestamps: true });

module.exports = mongoose.model("UserSettings", userSettingsSchema);
