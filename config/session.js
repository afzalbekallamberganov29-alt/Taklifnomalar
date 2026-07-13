const session = require("express-session");

/**
 * Sodda session-based autentifikatsiya (poydevor bosqichi uchun).
 * Eslatma: session'lar hozircha xotirada (MemoryStore) saqlanadi —
 * bitta instance uchun yetarli. Agar Render'da bir nechta instance
 * (scaling) ishlatilsa, keyinchalik session store'ni almashtirish kerak
 * bo'ladi (masalan, connect-pg-simple yoki Redis store).
 */
function createSessionMiddleware() {
  return session({
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 8, // 8 soat
    },
  });
}

module.exports = createSessionMiddleware;
