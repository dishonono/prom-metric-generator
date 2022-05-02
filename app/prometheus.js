const client = require('prom-client');
const promMid = require('express-prometheus-middleware');

const failureCounter = new client.Counter({
    name: 'http_request_failure_total',
    help: 'http_request_failure_total Counter for total failed requests',
    labelNames: ['method', 'statusCode', 'path']
});

async function reportMetrics(req, res, next) {
    await next();
    if (res.statusCode >= 400) {
        failureCounter.inc({method: req.method, statusCode: res.statusCode, path: req.path});
    }
}


function initPrometheusClient(app) {
    const collectDefaultMetrics = client.collectDefaultMetrics;
    const Registry = client.Registry;
    const register = new Registry();
    collectDefaultMetrics({ register });
    initPrometheusMiddleware(app);
    return client;
}


function initPrometheusMiddleware(app) {
    app.use(promMid({
        metricsPath: '/metrics',
        collectDefaultMetrics: true
    }));
    
    app.use(reportMetrics);
}

module.exports = { initPrometheusClient };
