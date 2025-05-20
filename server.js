const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

const VERIFY_TOKEN = 'ares_token';
const PAGE_ACCESS_TOKEN = 'EAAIp2OU3DIMBO7L4KQL5Y3EPK5DN7Fjr4icWcNWDooO4FEfoFFALPPETeZBlOvdbloKZCwSL4BDZBrQsIzWJczm6VRZBX0jZCIR3S3BasjEz8GRyPHfZA3QBkR7Q7iTtCTPZCOzBQTxx6yVj2TLQZCNZAZAaDNq0ZC9eZA6qWwQct3MnxSzFv1qg8t9uFuDrZB5bkyrB1NJn1el9maghx1FL4vKJqeIW8qPDBExGQ4SwoD3xq';

app.use(bodyParser.json());

// ✅ تحقق من Facebook
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

// ✅ دالة الرد
function sendMessage(senderId, messageText) {
  const url = `https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

  const body = {
    recipient: { id: senderId },
    message: { text: messageText }
  };

  axios.post(url, body)
    .then(() => console.log(`✅ تم الرد على ${senderId}`))
    .catch(err => console.error('❌ فشل الإرسال:', err?.response?.data || err));
}

// ✅ استقبال الرسائل
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      const event = entry.messaging?.[0];
      const sender = event?.sender?.id;
      const msg = event?.message?.text;

      console.log(`📩 رسالة من ${sender}: ${msg}`);

      if (msg?.toLowerCase().includes('السعر')) {
        sendMessage(sender, 'السعر هو 10,000 د.ع ❤️');
      }
    });

    res.status(200).send('تم الاستلام');
  } else {
    res.sendStatus(404);
  }
});

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 السيرفر شغال على http://0.0.0.0:${PORT}`);
});
