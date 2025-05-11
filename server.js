const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const msg = req.body.message;
  if (msg && msg.text) {
    console.log('📩 پیام جدید از کاربر:', msg.text);
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ejra roye prst ${PORT} shod`);
});
