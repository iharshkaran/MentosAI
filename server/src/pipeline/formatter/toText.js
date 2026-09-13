const fs = require("fs");
const path = require("path");

const toText = async (type, content) => {
  const fileName = `${type}-${Date.now()}.txt`;
  const filePath = path.join(__dirname, "../../../outputs", fileName);

  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
};

module.exports = { toText };