const express = require('express');
const app = express();
const { sleep, getTrueByOdds } = require('./utils');
const { initPrometheusClient, increaseFailureCount } = require('./prometheus');

initPrometheusClient(app);

app.get('/delay', async (req) => {
    const { delay = 1000 } = req.query;
    await sleep(delay);
    console.log(`sleeping for ${delay} miliseconds`);
});

app.get('/', async (req, res) => {
    const { failureChance = 0.99 } = req.query;
    const isFailure = getTrueByOdds(failureChance);
    if (isFailure){
        const { statusCode = 500 } = req.query;
        res.status(statusCode);
        return;
    }
    console.log('not failing!');
});


// app.post('/file', async (req) = {

// })


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Example api is listening on http://localhost:${PORT}`);
  });