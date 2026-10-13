const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");

const LOCAL_OBJECTS_DIR = path.resolve(__dirname, "../../uploads/objects");
const imageKitConfig = {
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
};
const configuredFields = Object.values(imageKitConfig).filter(Boolean).length;
if (configuredFields > 0 && configuredFields < Object.keys(imageKitConfig).length) {
  throw new Error("Configure both IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT.");
}

const imageKitEnabled = configuredFields === Object.keys(imageKitConfig).length;
let imageKitClientPromise;
const getImageKitClient = async () => {
  if (!imageKitEnabled) return null;
  imageKitClientPromise ||= import("@imagekit/nodejs").then(({ default: ImageKit }) => new ImageKit({
    privateKey: imageKitConfig.privateKey,
  }));
  return imageKitClientPromise;
};

const safeName = (value) => path.basename(value).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 160) || "file";
const normalizeKey = (key) => key.replace(/^\/+/, "").split("/").filter((part) => part && part !== "." && part !== "..").join("/");
const getLocalPath = (key) => {
  const objectPath = path.resolve(LOCAL_OBJECTS_DIR, normalizeKey(key));
  if (!objectPath.startsWith(`${LOCAL_OBJECTS_DIR}${path.sep}`)) throw new Error("Invalid storage key");
  return objectPath;
};

const assertProductionStorage = () => {
  if (!imageKitEnabled && process.env.NODE_ENV === "production") {
    throw new Error("ImageKit is required in production. Configure IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT to store user files safely.");
  }
};

const uploadPrivateFile = async ({ filePath, fileName, folder }) => {
  assertProductionStorage();
  if (!imageKitEnabled) return null;
  const client = await getImageKitClient();
  const uploaded = await client.files.upload({
    file: fs.createReadStream(filePath),
    fileName: safeName(fileName),
    folder,
    isPrivateFile: true,
    useUniqueFileName: true,
  });
  if (!uploaded.filePath) throw new Error("ImageKit upload did not return a file path");
  return `imagekit:${uploaded.filePath}`;
};

const saveSourceFile = async ({ file, userId, jobId }) => {
  const safeUserId = safeName(userId);
  const safeJobId = safeName(String(jobId));
  const key = await uploadPrivateFile({
    filePath: file.path,
    fileName: file.originalname,
    folder: `/users/${safeUserId}/jobs/${safeJobId}/sources`,
  });
  if (key) {
    return {
      key,
      originalName: safeName(file.originalname),
      contentType: file.mimetype || "application/octet-stream",
      size: file.size,
    };
  }

  const localKey = `users/${safeUserId}/jobs/${safeJobId}/sources/${require("crypto").randomUUID()}-${safeName(file.originalname)}`;
  const localPath = getLocalPath(localKey);
  await fsp.mkdir(path.dirname(localPath), { recursive: true });
  await pipeline(fs.createReadStream(file.path), fs.createWriteStream(localPath));
  return { key: localKey, originalName: safeName(file.originalname), contentType: file.mimetype || "application/octet-stream", size: file.size };
};

const contentTypeFor = (filename) => ({
  ".pdf": "application/pdf",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
}[path.extname(filename).toLowerCase()] || "application/octet-stream");

const storeGeneratedOutput = async ({ filename, userId, jobId }) => {
  assertProductionStorage();
  if (!imageKitEnabled) return filename;
  const localPath = path.resolve(__dirname, "../../outputs", path.basename(filename));
  const key = await uploadPrivateFile({
    filePath: localPath,
    fileName: filename,
    folder: `/users/${safeName(userId)}/jobs/${safeName(String(jobId))}/outputs`,
  });
  await fsp.unlink(localPath).catch(() => {});
  return key;
};

const pipeDownload = (source, res, filename, contentType) => {
  res.setHeader("Content-Type", contentType || "application/octet-stream");
  res.attachment(safeName(filename));
  source.on("error", (error) => {
    if (res.headersSent) return res.destroy(error);
    const status = error.code === "ENOENT" ? 404 : 500;
    return res.status(status).json({ error: status === 404 ? "Stored file not found" : "Could not read stored file" });
  });
  return source.pipe(res);
};

const downloadObject = async (key, res, filename, contentType) => {
  if (key.startsWith("imagekit:")) {
    if (!imageKitEnabled) throw new Error("ImageKit credentials are required to download this file");
    const filePath = key.slice("imagekit:".length);
    const client = await getImageKitClient();
    const signedUrl = client.helper.buildSrc({
      urlEndpoint: imageKitConfig.urlEndpoint,
      src: filePath.startsWith("/") ? filePath : `/${filePath}`,
      signed: true,
      expiresIn: 300,
    });
    const response = await fetch(signedUrl);
    if (!response.ok || !response.body) {
      const error = new Error(response.status === 404 ? "Stored file not found" : "Could not read stored file");
      error.code = response.status === 404 ? "ENOENT" : "IMAGEKIT_DOWNLOAD_FAILED";
      throw error;
    }
    return pipeDownload(Readable.fromWeb(response.body), res, filename, contentType || response.headers.get("content-type"));
  }

  const cleanKey = normalizeKey(key);
  return pipeDownload(fs.createReadStream(getLocalPath(cleanKey)), res, filename, contentType || contentTypeFor(filename));
};

module.exports = { imageKitEnabled, saveSourceFile, storeGeneratedOutput, downloadObject };
