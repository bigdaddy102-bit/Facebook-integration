# Facebook Integration

Eine Node.js Lösung für Facebook API Integration und Utilities.

## Features

- ✅ Facebook API Integration
- ✅ OAuth Authentication
- ✅ Graph API Support
- ✅ Konfigurierbar und erweiterbar

## Installation

```bash
git clone https://github.com/bigdaddy102-bit/facebook-integration
cd facebook-integration
npm install
```

## Setup

1. Erstelle eine `.env` Datei im Root-Verzeichnis:

```env
FACEBOOK_APP_ID=deine_app_id
FACEBOOK_APP_SECRET=dein_app_secret
FACEBOOK_PAGE_ACCESS_TOKEN=dein_page_token
PORT=3000
```

2. Starten:

```bash
npm start
```

## Entwicklung

Für die Entwicklung mit automatischem Reload:

```bash
npm run dev
```

## Struktur

```
src/
├── index.js       - Haupteinstiegspunkt
└── config.js      - Konfiguration
```

## Lizenz

MIT