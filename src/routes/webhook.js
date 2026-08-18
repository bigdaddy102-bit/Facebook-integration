const express = require('express');
const config = require('../config');

const router = express.Router();

/**
 * Webhook-Verifizierung (einmalig beim Einrichten im Meta App Dashboard).
 * Meta sendet hub.mode / hub.verify_token / hub.challenge; bei Übereinstimmung
 * muss hub.challenge unverändert zurückgegeben werden.
 */
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.webhookVerifyToken) {
    console.log('✅ Webhook verifiziert.');
    return res.status(200).send(challenge);
  }

  console.warn('❌ Webhook-Verifizierung fehlgeschlagen (falscher Token oder Mode).');
  return res.sendStatus(403);
});

/**
 * Empfängt Events von Meta (Messenger-Nachrichten, Page-Feed-Änderungen,
 * Kommentare etc.). Die Signatur wird bereits in server-weitem Middleware
 * (express.json({ verify: verifySignature })) geprüft, siehe src/index.js.
 */
router.post('/', (req, res) => {
  const body = req.body;

  if (body.object !== 'page') {
    return res.sendStatus(404);
  }

  for (const entry of body.entry || []) {
    // Messenger-Nachrichten
    for (const event of entry.messaging || []) {
      const senderId = event.sender?.id;
      if (event.message) {
        console.log(`📩 Nachricht von ${senderId}: ${event.message.text || '[Anhang/Sonstiges]'}`);
        // Hier könnte z.B. eine automatische Antwort über src/routes/messages.js
        // ausgelöst oder das AI-Assistant-Backend (noverah-assistant) informiert werden.
      } else if (event.postback) {
        console.log(`🔘 Postback von ${senderId}: ${event.postback.payload}`);
      }
    }

    // Page-Feed-/Kommentar-Änderungen (z.B. Produkt-Kommentare, Reviews)
    for (const change of entry.changes || []) {
      console.log(`🔔 Page-Change-Event: ${change.field}`, change.value);
    }
  }

  // Immer schnell mit 200 antworten, sonst deaktiviert Meta den Webhook
  // nach wiederholten Timeouts/Fehlern.
  return res.status(200).send('EVENT_RECEIVED');
});

module.exports = router;
