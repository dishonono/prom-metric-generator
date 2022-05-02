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

app.post('/', async (req, res) => {
    const { dependencyTracking, path, method, statusCode } = req.body;
    if (statusCode >= 400) {
        increaseFailureCounter(method, statusCode, path);
    }
    trackDependency(dependencyTracking);
    return res.json('Done digesting metrics!');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });