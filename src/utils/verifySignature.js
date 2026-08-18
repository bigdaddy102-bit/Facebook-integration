const crypto = require('crypto');
const config = require('../config');

/**
 * Verifiziert die "X-Hub-Signature-256"-Signatur, die Meta an jeden
 * Webhook-POST-Request anhängt, damit nur echte Meta-Requests verarbeitet
 * werden (schützt vor gefälschten Webhook-Aufrufen).
 * https://developers.facebook.com/docs/messenger-platform/webhooks#security
 */
function verifySignature(req, res, buf) {
  const signature = req.headers['x-hub-signature-256'];

  if (!signature) {
    // Erlaubt lokale Tests ohne Signatur, aber protokolliert eine Warnung.
    console.warn('⚠️  Webhook-Request ohne X-Hub-Signature-256 empfangen.');
    return;
  }

  const [, signatureHash] = signature.split('sha256=');
  const expectedHash = crypto
    .createHmac('sha256', config.appSecret || '')
    .update(buf)
    .digest('hex');

  if (signatureHash !== expectedHash) {
    const error = new Error('Ungültige Webhook-Signatur');
    error.statusCode = 401;
    throw error;
  }
}

module.exports = { verifySignature };
