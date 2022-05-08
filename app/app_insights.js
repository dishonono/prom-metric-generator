const appInsights = require('applicationinsights');
const config = require('./config');

const otherClient = new appInsights.TelemetryClient(config.appInsights.connectionString2);

function useAppInsights() {
    appInsights.setup(config.appInsights.connectionString)
    .start();
}

function trackDependency(obj) {
    console.log('reporting dpendency tracking:', obj)
    appInsights.defaultClient.trackDependency(obj);
    otherClient.trackDependency(obj);
}


module.exports = { useAppInsights, trackDependency };


