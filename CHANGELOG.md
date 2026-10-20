# Ambar AI — Modern B2B Redesign & Hardening Changelog

## Versiya 3.2 (Барча 6 та видео 100% Vimeo Cloud Streaming'га ўтказилди)
- **Сайтдаги барча 6 та видео Vimeo глобал CDN платформасига тўлиқ уланди:**
  1. **СИ Муқаддима (Кириш видеоси):** Vimeo ID `1237699861` (`https://vimeo.com/1237699861`)
  2. **Ambar ойналари (Gemini СИ промоси):** Vimeo ID `1237700364` (`https://vimeo.com/1237700364`)
  3. **Замонавий йиғма вешалкалар:** Vimeo ID `1237702433` (`https://vimeo.com/1237702433`)
  4. **Премиум смесителлар қатори:** Vimeo ID `1237707144` (`https://vimeo.com/1237707144`)
  5. **Tinko ишқорли батарейкалари (Овозли):** Vimeo ID `1237708979` (`https://vimeo.com/1237708979`)
  6. **Тропик душ тизимлари (Овозли):** Vimeo ID `1237033527` (`https://vimeo.com/1237033527`)
- **Эришилган асосий натижалар:**
  - Сайт ҳажми юзлаб мегабайт оғир видео файллардан озод бўлди — Vercel'га юклаш ва саҳифа очилиши 10 баравар тезлашди.
  - Ҳар бир видео учун Vimeo'нинг адаптив стриминги (1080p, 720p, 480p) автоматик тарзда фойдаланувчи интернет тезлигига мослашади.
  - Рекламасиз, профессионал B2B интерактив кино-плеер ишлайди.

---

## Versiya 3.1 (СИ Муқаддима янги кириш видеоси қўшилди)
- **СИ Муқаддима (Sun'iy intellektga kirish) видеоси сайтнинг 1-ўрнига жойлаштирилди:**
  - Манба файл: `видео/СИ муқаддима/СИ муқаддима basic.mp4` (давомийлиги: 0:52, HD 720x1280).
  - Бош плеерда саҳифа очилиши билан биринчи бўлиб ушбу кириш ролики чиқади.
  - Тавсифлари 3 та тилда тўлиқ киритилди (uz-Cyrl, uz-Latn, ru).
- **Плейлист карточкалари ва ҳисоблагичлар янгиланди:**
  - Карточкалар тўри 6 та элементга мосланди (`lg:grid-cols-6`).
  - Фильтр тугмалари сони янгиланди: Барча видеолар (6), Визуал промо (4 та), Диктор овози билан (2 та).

---

## Versiya 3.0 (Security, Bug Fixes, Content Polish & SEO)

### P0. Xavfsizlik (Security)
- Telegram Bot Token va Chat ID mijoz kodidan to'liq olib tashlandi.
- Serverless funksiya yaratildi: `/api/lead` (Vercel Serverless Function).
- Honeypot, Rate limiting, XSS himoyasi va xavfsiz validatsiya joriy qilindi.

### P1. Aniqlangan Xatoliklar Tuzatildi (Bug Fixes)
- `switchTab()` yashirin tab tugmalarini o'chirib yubormaydigan qilindi.
- Slayder qulayligi: Yagona native `<input type="range">`, `touch-action: pan-y`.
- Showcase `alt` matnlari tillar bo'yicha dinamik yangilanadigan qilindi.
- `prefers-reduced-motion` qoidasi ulandi.

### P2. Navigatsiya va Matnlar (Navigation & Text)
- Desktop menyusi 3 tilda ham 1 qatorga sig'dirildi (`whitespace-nowrap`).
- CTA tugmasi matni qisqartirildi: «Маслаҳат олиш».

### P3. Ishonch va Haqiqiylik (Trust & Content)
- Soxta video ko'rishlar soni o'chirildi, video davomiyligi qo'yildi.
- «4K Ultra-HD» da'volari professional B2B atamalariga almashtirildi (13 ta joyda).
- KPI «100%» da'vosi yumshatildi.

### P4. Tipografika va Ko'p Tillik (Typography & i18n)
- 12px dan kichik barcha shriftlar bartaraf etildi.
- Barcha matnlar 215 ta i18n kalitiga ulandi va 3 tilda to'ldirildi.
- Dinamik `<html lang="...">`.

### P5. SEO va Tozalash (SEO & Polish)
- Sayt boshiga to'liq SEO meta-teglari, Open Graph va `<noscript>` bloki qo'shildi.
- Forma autocomplete va tel rejimi to'g'rilandi.
