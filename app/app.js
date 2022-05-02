const express = require('express');
const app = express();
const { sleep, getTrueByOdds } = require('./utils');
const { initPrometheusClient, increaseFailureCounter } = require('./prometheus');
const { useAppInsights, trackDependency } = require('./app_insights');

initPrometheusClient(app);
useAppInsights(app);

app.use(express.json());

app.get('/', async (req, res) => {
    return res.json("don't worry, the app is up!");
});

app.post('/failures', async (req, res) => {
    const { path, method, statusCode } = req.body;
    if (statusCode >= 400) {
        increaseFailureCounter(method, statusCode, path);
    }
    return res.json('Done handling failure metrics!');
});

app.post('/dependencies', async (req, res) => {
    trackDependency(req.body);
    return res.json('Done handling dependency logs!');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });