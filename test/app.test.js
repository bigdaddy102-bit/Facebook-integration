const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');

process.env.NODE_ENV = 'test';
process.env.PORT = 0; // zufälligen freien Port verwenden

const app = require('../src/index');

test('GET /health antwortet mit status OK', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const body = await new Promise((resolve, reject) => {
      http
        .get(`http://127.0.0.1:${port}/health`, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(JSON.parse(data)));
        })
        .on('error', reject);
    });

    assert.strictEqual(body.status, 'OK');
  } finally {
    server.close();
  }
});
