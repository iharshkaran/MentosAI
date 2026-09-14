const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

// Markdown-ish text (##, **, -) ko simple HTML mein convert karta hai
const contentToHtml = (text) => {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const withHeadings = escaped
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^\* (.*)$/gm, "<li>$1</li>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br/>");

  return `
    <html>
      <head>
        <style>
          body { font-family: 'Calibri', Arial, sans-serif; color: #334155; padding: 40px; line-height: 1.6; }
          h1, h2, h3 { color: #1B2A4A; }
          li { margin-left: 20px; }
          p { margin: 0 0 12px 0; }
        </style>
      </head>
      <body><p>${withHeadings}</p></body>
    </html>
  `;
};

const toPdf = async (type, content) => {
  const html = contentToHtml(content);
  const fileName = `${type}-${Date.now()}.pdf`;
  const filePath = path.join(__dirname, "../../../outputs", fileName);

  const browser = await puppeteer.launch({ headless: "new" });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: filePath, format: "A4", margin: { top: "20px", bottom: "20px" } });
  } finally {
    await browser.close();
  }

  return fileName;
};

module.exports = { toPdf };