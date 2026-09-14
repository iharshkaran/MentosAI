const fs = require("fs");

const parseGeneric = (filePath) => {
  return fs.readFileSync(filePath, "utf-8");
};

module.exports = { parseGeneric };