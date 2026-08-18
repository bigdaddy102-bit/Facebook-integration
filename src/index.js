require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { verifySignature } = require('./utils/verifySignature');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
// verify() prüft die Meta-Webhook-Signatur (X-Hub-Signature-256) auf dem
// rohen Body, bevor er als JSON geparst wird.
app.use(express.json({ verify: verifySignature }));

// Routes
const webhookRouter = require('./routes/webhook');
const productsRouter = require('./routes/products');
const messagesRouter = require('./routes/messages');
const analyticsRouter = require('./routes/analytics');

app.use('/webhook', webhookRouter);
app.use('/api/products', productsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/analytics', analyticsRouter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Noverah Facebook Integration Service is running' });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.name || 'Error',
    message: err.message,
  });
});

// Nur automatisch starten, wenn die Datei direkt ausgeführt wird
// (nicht beim require() in Tests) - siehe test/app.test.js.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Noverah Facebook Integration läuft auf Port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;