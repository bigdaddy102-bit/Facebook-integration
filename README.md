# Facebook Integration – NOVERAH

Node.js-Service für die Meta-Integration (Facebook/Instagram) von [NOVERAH](https://www.noverah.de): Messenger-Webhooks, Produktkatalog-Sync mit Shopify und Page-Insights.

## Features

- ✅ Messenger-Webhook (Verifizierung + Empfang, inkl. Signaturprüfung `X-Hub-Signature-256`)
- ✅ Produktkatalog-Sync: aktive Shopify-Produkte (www.noverah.de) → Facebook/Instagram Commerce Catalog
- ✅ Messenger Send API (Textnachrichten)
- ✅ Facebook Page Insights (Reichweite, Interaktionen, Fans)

## Installation

```bash
npm install
cp .env.example .env   # Werte eintragen
npm start               # Produktion
npm run dev              # Entwicklung mit Auto-Reload (nodemon)
```

## Umgebungsvariablen

Siehe [`.env.example`](.env.example) für die vollständige Liste, u.a.:

| Variable | Zweck |
|---|---|
| `FACEBOOK_APP_SECRET` | Für die Webhook-Signaturprüfung |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Für Messenger-Nachrichten, Insights, Katalog-Sync |
| `FACEBOOK_CATALOG_ID` | Ziel-Commerce-Catalog für den Produktsync |
| `SHOPIFY_STORE_DOMAIN` / `SHOPIFY_ADMIN_API_TOKEN` | Quelle der Produktdaten (www.noverah.de) |

## Endpunkte

| Methode | Pfad | Zweck |
|---|---|---|
| `GET` | `/health` | Health-Check |
| `GET`/`POST` | `/webhook` | Meta-Webhook (Verifizierung / Events) |
| `GET` | `/api/products` | Aktive Shopify-Produkte auflisten |
| `POST` | `/api/products/sync-to-catalog` | Shopify-Produkte in den Facebook/Instagram-Katalog pushen |
| `POST` | `/api/messages/send` | Messenger-Textnachricht senden (`{ recipientId, text }`) |
| `GET` | `/api/analytics/page-insights` | Facebook Page Insights abrufen |

## Tests

```bash
npm test
```

## Sicherheit

Eingehende Webhook-Requests werden über die `X-Hub-Signature-256`-Header-Signatur verifiziert (`src/utils/verifySignature.js`), damit nur echte Meta-Requests verarbeitet werden. Secrets werden ausschließlich über Umgebungsvariablen gelesen, niemals hardcodiert.

## Lizenz

ISC
