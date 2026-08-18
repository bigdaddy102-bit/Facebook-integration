module.exports = {
  // Meta / Facebook App
  appId: process.env.FACEBOOK_APP_ID,
  appSecret: process.env.FACEBOOK_APP_SECRET,
  pageAccessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
  pageId: process.env.FACEBOOK_PAGE_ID,
  apiVersion: process.env.FACEBOOK_API_VERSION || 'v21.0',
  baseUrl: 'https://graph.facebook.com',

  // Webhook verification (Meta App Dashboard > Webhooks)
  webhookVerifyToken: process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN,

  // Meta Commerce Catalog (Facebook/Instagram Shop) für NOVERAH-Produktsync
  catalogId: process.env.FACEBOOK_CATALOG_ID,

  // Shopify Admin API (Quelle der Produktdaten für www.noverah.de)
  shopify: {
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN,
    adminApiToken: process.env.SHOPIFY_ADMIN_API_TOKEN,
    apiVersion: process.env.SHOPIFY_API_VERSION || '2024-10',
  },
};
