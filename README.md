# Toy Platform — 1-bosqich (Poydevor)

## Texnologiyalar
- Node.js 20 LTS + Express
- Session-based admin autentifikatsiya
- Multer + Cloudinary (rasm/video/musiqa uchun tashqi storage)
- JSON fayl asosidagi database (`utils/jsonDb.js`)
- Nanoid (ID va slug generatsiya uchun)

## Papka strukturasi
```
toy-platform/
├── server.js              # Kirish nuqtasi
├── config/
│   ├── cloudinary.js       # Cloudinary sozlamalari
│   └── session.js          # Session sozlamalari
├── middleware/
│   ├── requireAuth.js      # Admin route'larini himoyalash
│   └── upload.js           # Multer + Cloudinary upload logikasi
├── routes/
│   ├── auth.js              # login / logout / me
│   ├── upload.js            # fayl yuklash endpoint
│   └── invitations.js       # taklifnomalar CRUD
├── utils/
│   └── jsonDb.js            # JSON "database" qatlami
├── data/                    # JSON fayllar shu yerda saqlanadi
└── public/                  # Statik fayllar (keyingi bosqichda frontend shu yerga)
```

## Mahalliy ishga tushirish
```bash
npm install
cp .env.example .env
# .env faylini o'zingizning ma'lumotlaringiz bilan to'ldiring
npm start
```

Server: `http://localhost:3000`
Health check: `GET /api/health`

## Environment o'zgaruvchilari (.env)
| O'zgaruvchi | Tavsif |
|---|---|
| `PORT` | Server porti (Render o'zi beradi, lokal uchun 3000) |
| `SESSION_SECRET` | Session shifrlash uchun tasodifiy uzun matn |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin panel kirish ma'lumotlari |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | [cloudinary.com](https://cloudinary.com) bepul akkauntdan olinadi |

## Render'da deploy qilish
1. Render'da **New → Web Service** tanlang, shu repository'ni ulang.
2. Sozlamalar:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. **Environment** bo'limida yuqoridagi barcha o'zgaruvchilarni qo'shing.
4. Deploy tugagach `https://<sizning-app>.onrender.com/api/health` ni oching — `success: true` qaytishi kerak.

## ⚠️ Muhim arxitektura eslatmasi
`data/` papkasidagi JSON fayllar Render'ning standart (bepul) instance'larida
**doimiy emas** — deploy yoki qayta ishga tushish paytida tozalanishi mumkin.
Fayllar (rasm/video/musiqa) shu sababli Cloudinary'da saqlanadi va bu muammoga
uchramaydi, lekin taklifnoma/mijoz yozuvlari (JSON db) hozircha vaqtinchalik.
Loyiha jonli mahsulotga aylanganda buni Render Persistent Disk yoki haqiqiy
database (Postgres) bilan almashtirish tavsiya etiladi — arxitektura shunga
tayyor (`utils/jsonDb.js` qatlamini almashtirish yetarli, qolgan kod
o'zgarmaydi).

## Test qilingan endpoint'lar (1-bosqich)
- `GET /api/health` — server holatini tekshirish
- `POST /api/auth/login` — admin kirishi
- `GET /api/auth/me` — sessiya holati
- `POST /api/auth/logout` — chiqish
- `POST /api/upload` — fayl yuklash (Cloudinary'ga, `multipart/form-data`, maydon nomi: `file`)
- `POST /api/invitations` — yangi taklifnoma (admin, himoyalangan)
- `GET /api/invitations` — hammasi (admin)
- `GET /api/invitations/:slug` — bitta taklifnoma (ochiq)
- `PUT /api/invitations/:id` — tahrirlash (admin)
- `DELETE /api/invitations/:id` — o'chirish (admin)

## Keyingi bosqich
Frontend (mijoz uchun taklifnoma yaratish sahifasi va admin dashboard) —
2-bosqichda qo'shiladi.
