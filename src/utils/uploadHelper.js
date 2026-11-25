const d1 = require('../db/d1Client');
const r2 = require('../storage/r2Client');

/**
 * Upload an incoming multer file to R2/local storage and record it in uploads table.
 */
async function saveUploadedAsset(file) {
  const uploadRes = await r2.uploadFile(file.buffer, file.originalname, file.mimetype);
  await d1.prepare(`
    INSERT INTO uploads (original_name, file_key, file_url, storage_type, mime_type, file_size)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    uploadRes.originalName,
    uploadRes.fileKey,
    uploadRes.fileUrl,
    uploadRes.storageType,
    uploadRes.mimeType,
    uploadRes.size
  ).run();
  return uploadRes;
}

module.exports = {
  saveUploadedAsset
};
