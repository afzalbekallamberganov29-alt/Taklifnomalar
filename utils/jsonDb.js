/**
 * jsonDb.js
 * Oddiy JSON-fayl asosidagi "database" qatlami.
 *
 * MUHIM ESLATMA (Render uchun):
 * Render'ning bepul/standart instance'larida disk EPHEMERAL — ya'ni
 * deploy qilinganda yoki instance qayta ishga tushganda /data papkasidagi
 * o'zgarishlar YO'QOLISHI mumkin. Bu poydevor bosqichida buni bilib
 * turgan holda ishlatamiz. Loyiha jonli mahsulotga aylanganda:
 *   - Render Persistent Disk (pullik) ulash, YOKI
 *   - Haqiqiy DB (Postgres/Mongo) ga migratsiya qilish tavsiya etiladi.
 * Hozircha maqsad — arxitekturani to'g'ri qurish, keyin storage'ni
 * almashtirish oson bo'lishi kerak (shuning uchun bu qatlam alohida).
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

function filePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

/** Kolleksiya faylini o'qiydi, mavjud bo'lmasa bo'sh massiv bilan yaratadi */
function readCollection(collection) {
  const file = filePath(collection);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]", "utf-8");
    return [];
  }
  const raw = fs.readFileSync(file, "utf-8");
  try {
    return JSON.parse(raw || "[]");
  } catch (err) {
    console.error(`[jsonDb] ${collection}.json buzilgan, bo'sh massiv qaytarildi:`, err.message);
    return [];
  }
}

/** Butun kolleksiyani diskka yozadi */
function writeCollection(collection, data) {
  const file = filePath(collection);
  fs.writeFileSync(file, JSON.stringify(data, null, 2),
