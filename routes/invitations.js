const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const db = require("../utils/jsonDb");
const requireAuth = require("../middleware/requireAuth");

const COLLECTION = "invitations";

// GET /api/invitations - hammasi (faqat admin)
router.get("/", requireAuth, (req, res) => {
  const items = db.readCollection(COLLECTION);
  res.json({ success: true, data: items });
});

// GET /api/invitations/:slug - mijoz uchun ochiq (link orqali ko'rish)
router.get("/:slug", (req, res) => {
  const item = db.find(COLLECTION, (i) => i.slug === req.params.slug)[0];
  if (!item) {
    return res.status(404).json({ success: false, message: "Taklifnoma topilmadi" });
  }
  res.json({ success: true, data: item });
});

// POST /api/invitations - yangi taklifnoma yaratish
router.post("/", requireAuth, (req, res) => {
  const { coupleNames, eventDate, template } = req.body;

  if (!coupleNames || !eventDate) {
    return res.status(400).json({ success: false, message: "Majburiy maydonlar to'ldirilmagan" });
  }

  const record = {
    id: nanoid(),
    slug: nanoid(8),
    coupleNames,
    eventDate,
    template: template || "default",
    mediaUrls: [],
    rsvps: [],
    createdAt: new Date().toISOString(),
  };

  db.insert(COLLECTION, record);
  res.status(201).json({ success: true, data: record });
});

// PUT /api/invitations/:id - tahrirlash
router.put("/:id", requireAuth, (req, res) => {
  const updated = db.updateById(COLLECTION, req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Taklifnoma topilmadi" });
  }
  res.json({ success: true, data: updated });
});

// DELETE /api/invitations/:id
router.delete("/:id", requireAuth, (req, res) => {
  const deleted = db.deleteById(COLLECTION, req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Taklifnoma topilmadi" });
  }
  res.json({ success: true, message: "O'chirildi" });
});

module.exports = router;
