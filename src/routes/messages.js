const express = require('express');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

/**
 * POST /api/messages/send
 * Body: { recipientId: string, text: string }
 * Sendet eine Textnachricht über die Messenger Send API.
 * https://developers.facebook.com/docs/messenger-platform/reference/send-api
 */
router.post('/send', async (req, res, next) => {
  try {
    const { recipientId, text } = req.body || {};
    if (!recipientId || !text) {
      const error = new Error('recipientId und text sind erforderlich.');
      error.statusCode = 400;
      throw error;
    }
    if (!config.pageAccessToken) {
      const error = new Error('FACEBOOK_PAGE_ACCESS_TOKEN ist nicht gesetzt.');
      error.statusCode = 412;
      throw error;
    }

    const response = await axios.post(
      `${config.baseUrl}/${config.apiVersion}/me/messages`,
      {
        recipient: { id: recipientId },
        message: { text },
        messaging_type: 'RESPONSE',
      },
      { params: { access_token: config.pageAccessToken } },
    );

    res.json({ message: 'Nachricht gesendet.', result: response.data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
