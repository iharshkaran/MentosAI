const path = require("path");
const pptxgen = require("pptxgenjs");

const parseSlideJson = (rawContent) => {
    const cleaned = rawContent.replace(/```json|```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleaned;
    return JSON.parse(jsonString);
};

const toPptx = async (rawContent) => {
    const { slides } = parseSlideJson(rawContent);

    const pres = new pptxgen();
    pres.layout = "LAYOUT_WIDE";

    slides.forEach((slideData) => {
        const slide = pres.addSlide();

        slide.addText(slideData.title || "", {
            x: 0.5, y: 0.4, w: 12.3, h: 0.9,
            fontFace: "Calibri", fontSize: 28, bold: true, color: "1B2A4A",
        });

        const bulletText = (slideData.bullets || []).map((b) => ({
            text: b,
            options: { bullet: true, breakLine: true, paraSpaceAfter: 10 },
        }));

        slide.addText(bulletText, {
            x: 0.5, y: 1.5, w: 12.3, h: 5.5,
            fontFace: "Calibri", fontSize: 18, color: "334155",
            valign: "top",
        });

        if (slideData.speakerNotes) {
            slide.addNotes(slideData.speakerNotes);
        }
    });

    const fileName = `presentation-${Date.now()}.pptx`;
    const filePath = path.join(__dirname, "../../../outputs", fileName);
    await pres.writeFile({ fileName: filePath });

    return fileName;
};

module.exports = { toPptx };