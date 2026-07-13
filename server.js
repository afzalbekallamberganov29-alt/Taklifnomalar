require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const createSessionMiddleware = require("./config/session");
const db = require("./utils/jsonDb");

// Route modullari
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const invitationRoutes = require("./routes/invitations");

const app = express();
const PORT = process.env.PORT || 3000;

// Ishga tushishda kerakli JSON kolleksiyalarni tayyorlaymiz
db.ensureCollections(["invitations", "clients"]);

// Middleware'lar
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(createSessionMiddleware());
app.use(express.static("public"));

// Health check - Render'da deploy muvaffaqiyatini tekshirish uchun
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server ishlayapti", time: new Date().toISOString() });
});

// API route'lar
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/invitations", invitationRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Sahifa topilmadi" });
});

// Umumiy xato ushlagich
app.use((err, req, res, next) => {
  console.error("[server] Kutilmagan xatolik:", err);
  res.status(500).json({ success: false, message: "Server xatosi" });
});

app.listen(PORT, () => {
  console.log(`✅ Server http://localhost:${PORT} da ishga tushdi`);
});
