const DOMAIN_GUIDANCE = {
  threat_intelligence: "This is threat intelligence content. Use precise security terminology, avoid sensationalism, and prioritize actionable clarity over narrative flair.",
  incident_report: "This is an incident report. Maintain a factual, chronological, precise tone. State only what is confirmed; clearly flag anything uncertain rather than speculating.",
  advisory: "This is advisory-source content. Keep language authoritative and directive — clearly separate findings from recommended actions.",
  policy_document: "This is policy or regulatory content. Preserve procedural and compliance precision; do not oversimplify legal or regulatory language.",
  research_paper: "This is research content. Preserve methodological accuracy and do not overstate findings beyond what the source supports.",
  news_article: "This is news content. Keep tone neutral and factual; do not inject opinions not present in the source.",
  report: "This is a formal report. Keep structure logical and findings clearly separated from interpretation.",
  announcement: "This is an announcement. Keep tone clear, confident, and audience-facing.",
  free_form_prompt: "This is a free-form request without a fixed document structure. Interpret intent generously and prioritize clarity.",
};

const getDomainGuidance = (sourceCategory) => DOMAIN_GUIDANCE[sourceCategory] || "";

const DOMAIN_CATEGORIES = Object.keys(DOMAIN_GUIDANCE);

module.exports = { getDomainGuidance, DOMAIN_CATEGORIES };