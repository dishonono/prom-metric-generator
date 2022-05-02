const appInsights = require('applicationinsights');
const config = require('./config');
const { getDurationInMilliseconds } = require('./utils');


function useAppInsights(app) {
    setupAppInsights();
    app.use(DbMiddlewareTracker);
}

function setupAppInsights() {
    appInsights.setup(config.appInsights.connectionString)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(true)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
    .start();
}

function DbMiddlewareTracker(req, res, next) {
    const start = process.hrtime();

    res.on('finish', () => {
        const success = res.statusCode < 400;
        const durationInMilliseconds = getDurationInMilliseconds(start);

        appInsights.defaultClient.trackDependency({
             target:"http://customers-db",
             name:"select customers proc",
             data:"SELECT * FROM Customers",
             duration:durationInMilliseconds,
             resultCode:success,
             success: success,
             dependencyTypeName: "ZSQL"
            });

        console.log(`${req.method} ${req.originalUrl} [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`)
    })
    next();
}

module.exports = { useAppInsights };


