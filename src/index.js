require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

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
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Noverah Facebook Integration läuft auf Port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});