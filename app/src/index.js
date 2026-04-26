const express = require('express');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;

const register = new client.Registry();
register.setDefaultLabels({ app: 'mon-app-devops' });
client.collectDefaultMetrics({ register });

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Hello DevOps TP!' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ healthy: true });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

if (require.main === module) {
  app.listen(PORT, () => {
    // Keep startup logs visible in container logs and Jenkins console.
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
