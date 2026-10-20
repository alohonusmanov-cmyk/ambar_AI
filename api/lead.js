// Vercel Serverless Function: /api/lead
// Securely forwards lead submissions to Telegram without exposing tokens to the client.

// In-memory rate limiting map for basic protection against spam bursts
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, startTime: now };

  if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    record.count = 1;
    record.startTime = now;
  } else {
    record.count += 1;
  }

  rateLimitMap.set(ip, record);

  // Periodic cleanup of stale records
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now - value.startTime > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    }
  }

  return record.count <= MAX_REQUESTS_PER_WINDOW;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Faqat POST so\'rovlari qabul qilinadi' });
  }

  try {
    // 1. IP & Rate Limiting
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
               req.socket?.remoteAddress || 
               'unknown';

    if (!checkRateLimit(ip)) {
      return res.status(429).json({ 
        ok: false, 
        error: 'Juda ko\'p so\'rov yuborildi. Iltimos, bir ozdan keyin qayta urinib ko\'ring.' 
      });
    }

    const body = req.body || {};

    // 2. Honeypot check (hidden field to trap spam bots)
    if (body.website || body._gotcha) {
      // Silently return success to bot without sending anything
      return res.status(200).json({ ok: true });
    }

    // 3. Extract and sanitize fields
    const name = (body.name || '').trim();
    const phone = (body.phone || '').trim();
    const company = (body.company || '').trim();
    const service = (body.service || '').trim();
    const comment = (body.comment || body.message || '').trim();
    const lang = (body.lang || 'uz-Cyrl').trim();

    // 4. Input validation
    if (!name) {
      return res.status(400).json({ ok: false, error: 'Ismingizni kiriting' });
    }
    if (name.length > 100) {
      return res.status(400).json({ ok: false, error: 'Ism 100 belgidan oshmasligi kerak' });
    }

    if (!phone) {
      return res.status(400).json({ ok: false, error: 'Telefon raqamingizni kiriting' });
    }
    if (phone.length > 30) {
      return res.status(400).json({ ok: false, error: 'Telefon raqami juda uzun' });
    }

    // Phone format validation (allows international format: +998 90 123 45 67)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)\.]{7,25}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ ok: false, error: 'Telefon raqami noto\'g\'ri formatda' });
    }

    if (company.length > 150) {
      return res.status(400).json({ ok: false, error: 'Korxona nomi 150 belgidan oshmasligi kerak' });
    }
    if (service.length > 150) {
      return res.status(400).json({ ok: false, error: 'Xizmat nomi 150 belgidan oshmasligi kerak' });
    }
    if (comment.length > 1000) {
      return res.status(400).json({ ok: false, error: 'Xabar 1000 belgidan oshmasligi kerak' });
    }

    // 5. Environment Variables
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (!botToken || !chatId) {
      // Configuration error on server side
      return res.status(500).json({ 
        ok: false, 
        error: 'Server sozlamalarida xatolik (BOT_TOKEN yoki CHAT_ID mavjud emas)' 
      });
    }

    // 6. Build Telegram Message
    const nowStr = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });
    const messageText = 
      `🔔 <b>ЯНГИ СИ МАСЛАҲАТ СЎРОВИ!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 <b>Исм:</b> ${escapeHtml(name)}\n` +
      `📞 <b>Телефон:</b> <code>${escapeHtml(phone)}</code>\n` +
      `🏢 <b>Корхона / Соҳа:</b> ${escapeHtml(company || 'Кўрсатилмаган')}\n` +
      `🛠 <b>Хизмат тури:</b> ${escapeHtml(service || 'Умумий маслаҳат')}\n` +
      `💬 <b>Савол / Изоҳ:</b>\n${escapeHtml(comment || 'Изоҳ қолдирилмаган')}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🌐 <b>Сайт тили:</b> ${escapeHtml(lang)}\n` +
      `⏰ <b>Вақт:</b> ${escapeHtml(nowStr)}`;

    // 7. Dispatch to Telegram Bot API
    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML'
      })
    });

    const telegramData = await telegramRes.json();

    if (!telegramData.ok) {
      return res.status(502).json({ 
        ok: false, 
        error: 'Telegram API xabarni qabul qilmadi' 
      });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    return res.status(500).json({ 
      ok: false, 
      error: 'Serverda kutilmagan xatolik yuz berdi' 
    });
  }
};
