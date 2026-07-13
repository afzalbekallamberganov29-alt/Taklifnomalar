const express = require("express");
const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Login va parol kiriting" });
  }

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (username === validUsername && password === validPassword) {
    req.session.isAdmin = true;
    req.session.username = username;
    return res.json({ success: true, message: "Muvaffaqiyatli kirdingiz" });
  }

  return res.status(401).json({ success: false, message: "Login yoki parol xato" });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Chiqishda xatolik" });
    }
    res.clearCookie("connect.sid");
    return res.json({ success: true, message: "Chiqdingiz" });
  });
});

// GET /api/auth/me - joriy sessiya holatini tekshirish
router.get("/me", (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.json({ success: true, isAdmin: true, username: req.session.username });
  }
  return res.json({ success: true, isAdmin: false });
});

module.exports = router;
