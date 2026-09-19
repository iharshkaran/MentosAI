const axios = require("axios");
const officeParser = require("officeparser");
const { fetchTranscript } = require("youtube-transcript-plus");

const YOUTUBE_REGEX = /(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const isYoutubeUrl = (url) => YOUTUBE_REGEX.test(url);

const extractYoutubeTranscript = async (url) => {
  const videoId = url.match(YOUTUBE_REGEX)[2];
  const segments = await fetchTranscript(videoId);
  return segments.map((s) => s.text).join(" ");
};

const extractWebpageText = async (url) => {
  const { data: html } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    timeout: 10000,
    responseType: "text",
  });

  const result = await officeParser.parseOffice(Buffer.from(html), { fileType: "html" });
  return result.toText();
};

const extractFromUrl = async (url) => {
  if (isYoutubeUrl(url)) return extractYoutubeTranscript(url);
  return extractWebpageText(url);
};

module.exports = { extractFromUrl, isYoutubeUrl };