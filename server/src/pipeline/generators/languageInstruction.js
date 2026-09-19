const LANGUAGE_NAMES = {
  en: "English", hi: "Hindi", es: "Spanish", fr: "French",
  de: "German", ar: "Arabic", pt: "Portuguese", zh: "Chinese",
};

const getLanguageInstruction = (code) => {
  if (!code || code === "en") return "";
  const name = LANGUAGE_NAMES[code] || code;
  return `Write the entire output in ${name}. Do not include English text except for proper nouns, brand names, or technical terms that have no common ${name} equivalent.`;
};

module.exports = { getLanguageInstruction };