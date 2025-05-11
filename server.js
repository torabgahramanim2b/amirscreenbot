const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

const TELEGRAM_TOKEN = '7708097244:AAH1hk1UP4SRNXhkXrpwG4ig9zZBXN3pnRE'; // جایگزین شود
const CHAT_ID = '8057556459'; // جایگزین شود

app.use(express.json());

app.post('/webhook', (req, res) => {
  const msg = req.body.message;
  if (msg && msg.text) {
    console.log('📩 پیام جدید از تلگرام:', msg.text);
  }
  res.sendStatus(200);
});

app.post('/upload', upload.single('screenshot'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const form = new FormData();
  form.append('chat_id', CHAT_ID);
  form.append('photo', fs.createReadStream(req.file.path));

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: form,
    });

    const result = await response.json();
    console.log('✅ عکس ارسال شد به تلگرام:', result);

    fs.unlinkSync(req.file.path); // حذف عکس از سرور بعد از ارسال
    res.send('✅ عکس آپلود و ارسال شد.');
  } catch (err) {
    console.error('❌ خطا در ارسال به تلگرام:', err);
    res.status(500).send('ارسال به تلگرام ناموفق بود.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 سرور روی پورت ${PORT} اجرا شد`);
});
