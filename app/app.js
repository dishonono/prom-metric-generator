const express = require('express');
const app = express();
const { sleep, getTrueByOdds } = require('./utils');
const { initPrometheusClient } = require('./prometheus');
const { useAppInsights } = require('./app_insights');

initPrometheusClient(app);
useAppInsights(app);

app.get('/delay', async (req) => {
    const { delay = 1000 } = req.query;
    await sleep(delay);
    console.log(`sleeping for ${delay} miliseconds`);
});

app.post('/file', (req, res) => {

});

app.get('/', async (req, res) => {
    const { failureChance = 0.01 } = req.query;
    const isFailure = getTrueByOdds(failureChance);
    if (isFailure){
        const { statusCode = 500 } = req.query;
        res.status(statusCode).json('filing on purpose');
        return;
    }
    res.status(200).json('filing on purpose');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Example api is listening on http://localhost:${PORT}`);
  });