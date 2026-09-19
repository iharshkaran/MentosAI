const officeParser = require("officeparser");

const EXT_TO_FILETYPE = {
  ".pdf": "pdf", ".docx": "docx", ".pptx": "pptx", ".xlsx": "xlsx",
  ".odt": "odt", ".odp": "odp", ".ods": "ods", ".rtf": "rtf",
  ".csv": "csv", ".md": "md", ".epub": "epub",
  ".html": "html", ".htm": "html",
};

const parseOfficeFile = async (filePath, ext) => {
  const fileType = EXT_TO_FILETYPE[ext];
  // officeparser v7+ returns an object with a toText() method
  const result = await officeParser.parseOffice(filePath, { fileType });
  return result.toText();
};

module.exports = { parseOfficeFile };