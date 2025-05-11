const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

const app = express();

const TELEGRAM_TOKEN = '7708097244:AAH1hk1UP4SRNXhkXrpwG4ig9zZBXN3pnRE'; // ← جایگزین کن
const CHAT_ID = '8057556459'; // ← اختیاری؛ فقط اگه بخوای از قبل تعریف شده باشه

const API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
let lastUpdateId = 0;

async function checkForMessages() {
  try {
    const res = await fetch(`${API_URL}/getUpdates?offset=${lastUpdateId + 1}`);
    const data = await res.json();

    if (data.ok && data.result.length > 0) {
      for (const msg of data.result) {
        lastUpdateId = msg.update_id;
        if (msg.message && msg.message.text) {
          const text = msg.message.text;
          const user = msg.message.chat.id;
          console.log('📩 پیام جدید:', text);

          // اینجا پیام رو بررسی کن، مثلاً پاسخ بده
          if (text.toLowerCase() === 'hi' || text === 'سلام') {
            await fetch(\`\${API_URL}/sendMessage\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: user,
                text: 'درود بر تو 🌟 من زنده‌ام!'
              })
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('❌ خطا در گرفتن پیام:', err);
  }
}

// هر 2 ثانیه پیام‌ها چک می‌شن
setInterval(checkForMessages, 2000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`🚀 Bot polling on port \${PORT}\`);
});
