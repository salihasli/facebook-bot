const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const VERIFY_TOKEN = 'ares_token';

app.use(bodyParser.json());

// تحقق فيسبوك
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    console.log('✅ تحقق فيسبوك نجح');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// استقبال الرسائل من فيسبوك
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      const event = entry.messaging[0];
      const sender = event.sender.id;
      const msg = event.message?.text;
      console.log(`📩 رسالة جديدة من ${sender}: ${msg}`);
    });

    res.status(200).send('تم الاستلام');
  } else {
    res.sendStatus(404);
  }
});

// 👇 هذا السطر المهم
app.listen(3000, '0.0.0.0', () => {
  console.log('🚀 السيرفر شغال على http://0.0.0.0:3000');
});
