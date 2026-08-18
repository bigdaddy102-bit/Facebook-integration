const express = require('express');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

/**
 * Holt alle aktiven Produkte aus dem Shopify-Store (www.noverah.de) über die
 * Admin REST API.
 */
async function fetchShopifyProducts() {
  const { storeDomain, adminApiToken, apiVersion } = config.shopify;
  if (!storeDomain || !adminApiToken) {
    const error = new Error(
      'Shopify nicht konfiguriert. Bitte SHOPIFY_STORE_DOMAIN und SHOPIFY_ADMIN_API_TOKEN setzen.',
    );
    error.statusCode = 412;
    throw error;
  }

  const products = [];
  let url = `https://${storeDomain}/admin/api/${apiVersion}/products.json?status=active&limit=250`;

  while (url) {
    const response = await axios.get(url, {
      headers: { 'X-Shopify-Access-Token': adminApiToken },
    });
    products.push(...response.data.products);

    // Shopify liefert Pagination über den Link-Header (cursor-basiert).
    const linkHeader = response.headers.link;
    const nextMatch = linkHeader && linkHeader.match(/<([^>]+)>;\s*rel="next"/);
    url = nextMatch ? nextMatch[1] : null;
  }

  return products;
}

/**
 * Wandelt ein Shopify-Produkt in ein Meta-Commerce-Catalog-Item um.
 * https://developers.facebook.com/docs/marketing-api/catalog/reference
 */
function toCatalogItem(product) {
  const variant = product.variants?.[0] || {};
  const image = product.image?.src || product.images?.[0]?.src || '';

  return {
    method: 'UPDATE',
    retailer_id: `shopify_${product.id}`,
    data: {
      name: product.title,
      description: (product.body_html || '').replace(/<[^>]*>/g, '').slice(0, 5000),
      availability: variant.inventory_quantity > 0 ? 'in stock' : 'out of stock',
      condition: 'new',
      price: `${Number(variant.price || 0).toFixed(2)} EUR`,
      link: `https://www.noverah.de/products/${product.handle}`,
      image_link: image,
      brand: product.vendor || 'NOVERAH',
      inventory: variant.inventory_quantity ?? 0,
    },
  };
}

/**
 * GET /api/products
 * Liste aller aktiven Shopify-Produkte (zur Kontrolle vor dem Sync).
 */
router.get('/', async (req, res, next) => {
  try {
    const products = await fetchShopifyProducts();
    res.json({ count: products.length, products });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/products/sync-to-catalog
 * Synchronisiert alle aktiven Shopify-Produkte in den verknüpften
 * Facebook/Instagram Commerce Catalog (max. 5000 Items pro Batch-Request,
 * hier in 500er-Chunks um die API stabil zu halten).
 */
router.post('/sync-to-catalog', async (req, res, next) => {
  try {
    if (!config.catalogId) {
      const error = new Error('FACEBOOK_CATALOG_ID ist nicht gesetzt.');
      error.statusCode = 412;
      throw error;
    }

    const products = await fetchShopifyProducts();
    const items = products.map(toCatalogItem);

    const chunkSize = 500;
    const results = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      const response = await axios.post(
        `${config.baseUrl}/${config.apiVersion}/${config.catalogId}/items_batch`,
        {
          item_type: 'PRODUCT_ITEM',
          requests: chunk,
          access_token: config.pageAccessToken,
        },
      );
      results.push(response.data);
    }

    res.json({
      message: `${items.length} Produkte an Facebook/Instagram Commerce Catalog gesendet.`,
      batches: results,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
