const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

// Fayllarni diskka emas, xotiraga (buffer) olamiz, so'ng to'g'ridan-to'g'ri
// Cloudinary'ga uzatamiz. Bu Render'ning ephemeral diskiga bog'liq bo'lmaslik
// uchun qilinadi — fayllar doimiy ravishda Cloudinary'da saqlanadi.
const storage = multer.memoryStorage();

const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
];

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error(`Ruxsat etilmagan fayl turi: ${file.mimetype}`));
  },
});

/**
 * Buffer'dagi faylni Cloudinary'ga yuklaydi.
 * @param {Buffer} buffer
 * @param {Object} options - { folder, resource_type }
 * @returns {Promise<Object>} Cloudinary javobi (secure_url, public_id, ...)
 */
function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "toy-platform",
        resource_type: options.resource_type || "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

module.exports = { upload, uploadBufferToCloudinary };
