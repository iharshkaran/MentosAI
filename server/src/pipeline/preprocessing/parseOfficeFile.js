const officeParser = require("officeparser");

const EXT_TO_FILETYPE = {
  ".pdf": "pdf", ".docx": "docx", ".pptx": "pptx", ".xlsx": "xlsx",
  ".odt": "odt", ".odp": "odp", ".ods": "ods", ".rtf": "rtf",
  ".csv": "csv", ".md": "md", ".epub": "epub",
  ".html": "html", ".htm": "html",
};

const parseOfficeFile = async (filePath, ext) => {
  const fileType = EXT_TO_FILETYPE[ext];
  const ast = await officeParser.parseOffice(filePath, { fileType });
  const { value } = await ast.to("text");
  return value;
};

module.exports = { parseOfficeFile };