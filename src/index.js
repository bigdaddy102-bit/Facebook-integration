require('dotenv').config();
const express = require('express');
const config = require('./config');

const app = express();

app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Facebook Integration Service is running' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
  console.log(`📱 Facebook App ID: ${config.appId}`);
});