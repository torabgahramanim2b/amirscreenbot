const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

const TELEGRAM_TOKEN = '7708097244:AAH1hk1UP4SRNXhkXrpwG4ig9zZBXN3pnRE'; // ← توکن ربات
const CHAT_ID = '8057556459'; // ← آیدی عددی تلگرام خودت

app.use(express.json());

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
    console.log('✅ Sent to Telegram:', result);

    // حذف فایل از سرور بعد از ارسال
    fs.unlinkSync(req.file.path);

    res.send('✅ Uploaded and sent to Telegram.');
  } catch (err) {
    console.error('❌ Error sending to Telegram:', err);
    res.status(500).send('Telegram send failed.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
