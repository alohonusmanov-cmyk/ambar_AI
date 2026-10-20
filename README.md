# Ambar AI — Vercel Deployment & Environment Variables

## 1. Telegram Bot Xavfsizligi va Sozlash (Vercel)

Saytdagi barcha mijozlar so'rovlari endi brauzerdan to'g'ridan-to'g'ri Telegram API ga yuborilmaydi. Buning o'rniga xavfsiz Vercel Serverless Function (`/api/lead`) ishlatiladi.

### Vercel da Environment Variables (Muhit o'zgaruvchilari) ni o'rnatish:

1. **Vercel Dashboard** ga kiring: [vercel.com](https://vercel.com)
2. Loyihangizni tanlang (**Project Settings**).
3. Chap menyudan **Environment Variables** bo'limiga o'ting.
4. Quyidagi ikkita o'zgaruvchini qo'shing:
   - **`BOT_TOKEN`**: `@BotFather` dan olgan yangi Telegram Bot HTTP API tokeningiz.
   - **`CHAT_ID`**: `@userinfobot` orqali olingan shaxsiy yoki guruh Chat ID raqamingiz.
5. **Save** tugmasini bosing va loyihani qayta deploy qiling (**Redeploy**).

> ⚠️ **Muhim:** Eskirgan tokenni `@BotFather` da `/revoke` buyrug'i orqali bekor qiling va yangi token oling. Hech qachon bot tokenini GitHub repozitoriysiga yoki ommaviy kodlarga yozmang!

---

## 2. Serverless Funksiya Xususiyatlari (`api/lead.js`)
- **Input Validation**: `name` va `phone` mavjudligi, ruxsat etilgan uzunliklar va telefon raqami regex tekshiruvi.
- **Honeypot Protection**: Spam-botlarni ushlash uchun ko'rinmas `website` maydoni. Agar robot uni to'ldirsa, so'rov Telegram ga bormaydi.
- **Rate Limiting**: Bitta IP manzildan har 10 daqiqada maksimal 5 ta so'rov qabul qilinadi.
- **HTML Xavfsizligi**: Telegram xabarida HTML inyeksiyalarni oldini olish uchun barcha belgilar ekranlanadi (`escapeHtml`).

---

## 3. CSS ni qayta kompilyatsiya qilish (Tailwind CLI)
Loyihada Tailwind CLI o'rnatilgan:
```bash
# CSS ni minifikatsiya qilib dist/output.css ga yig'ish:
npm run build:css

# Ishlab chiqish vaqtida avtomatik kuzatish:
npm run watch:css
```
