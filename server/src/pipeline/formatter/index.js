const { toText } = require("./toText");
const { toPptx } = require("./toPptx");
const { toPdf } = require("./toPdf");

const formatOutput = async (type, content) => {
    switch (type) {
        case "presentation":
            return toPptx(content);
        case "advisory":
        case "execSummary":
            return toPdf(type, content);
        case "linkedin":
        case "twitter":
        case "infographic":
        case "videoPackage":
        default:
            return toText(type, content);
    }
};

module.exports = { formatOutput };