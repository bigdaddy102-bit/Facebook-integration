const express = require('express');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

const DEFAULT_METRICS = [
  'page_impressions',
  'page_engaged_users',
  'page_post_engagements',
  'page_fans',
].join(',');

/**
 * GET /api/analytics/page-insights?period=day&since=YYYY-MM-DD&until=YYYY-MM-DD
 * Facebook-Page-Insights für die NOVERAH-Page (Reichweite, Interaktionen, Fans).
 * https://developers.facebook.com/docs/graph-api/reference/v21.0/insights
 */
router.get('/page-insights', async (req, res, next) => {
  try {
    if (!config.pageId || !config.pageAccessToken) {
      const error = new Error(
        'FACEBOOK_PAGE_ID und FACEBOOK_PAGE_ACCESS_TOKEN müssen gesetzt sein.',
      );
      error.statusCode = 412;
      throw error;
    }

    const { period = 'day', since, until, metric } = req.query;

    const response = await axios.get(
      `${config.baseUrl}/${config.apiVersion}/${config.pageId}/insights`,
      {
        params: {
          metric: metric || DEFAULT_METRICS,
          period,
          since,
          until,
          access_token: config.pageAccessToken,
        },
      },
    );

    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
