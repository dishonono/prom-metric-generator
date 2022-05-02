const client = require('prom-client');
const promMid = require('express-prometheus-middleware');

const failureCounter = new client.Counter({
    name: 'http_request_failure_total',
    help: 'http_request_failure_total Counter for total failed requests',
    labelNames: ['method', 'statusCode', 'path']
});

function increaseFailureCounter(method, statusCode, path) {
    console.log('increasing failure count:', {method, statusCode, path});
    failureCounter.inc({method, statusCode, path});
}

function initPrometheusClient(app) {
    usePrometheus(app);
    return client;
}

function usePrometheus(app) {
    app.use(promMid({
        metricsPath: '/metrics',
        collectDefaultMetrics: false
    }));    
}

module.exports = { initPrometheusClient, increaseFailureCounter };
