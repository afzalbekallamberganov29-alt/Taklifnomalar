const express = require("express");
const router = express.Router();
const { upload, uploadBufferToCloudinary } = require("../middleware/upload");

// POST /api/upload - bitta fayl yuklaydi (rasm/video/musiqa), Cloudinary havolasini qaytaradi
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Fayl topilmadi" });
    }

    const resourceType = req.file.mimetype.startsWith("video")
      ? "video"
      : req.file.mimetype.startsWith("audio")
      ? "video" // Cloudinary audio fayllarni ham "video" resource_type sifatida qabul qiladi
      : "image";

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "toy-platform/uploads",
      resource_type: resourceType,
    });

    return res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    });
  } catch (err) {
    console.error("[upload] xatolik:", err.message);
    return res.status(500).json({ success: false, message: "Yuklashda xatolik yuz berdi" });
  }
});

module.exports = router;
