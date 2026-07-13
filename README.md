# Toy Platform — 1-bosqich (Poydevor)

## Texnologiyalar
- Node.js 20 LTS + Express
- Session-based admin autentifikatsiya
- Multer + Cloudinary (rasm/video/musiqa uchun tashqi storage)
- JSON fayl asosidagi database (utils/jsonDb.js)
- Nanoid (ID va slug generatsiya uchun)

## Mahalliy ishga tushirish
npm install
cp .env.example .env
npm start

Server: http://localhost:3000
Health check: GET /api/health

## Render'da deploy qilish
1. Render'da New → Web Service tanlang, shu repository'ni ulang.
2. Build Command: npm install
3. Start Command: npm start
4. Environment bo'limida barcha .env o'zgaruvchilarini qo'shing.

## Keyingi bosqich
Frontend va admin dashboard — 2-bosqichda qo'shiladi.
