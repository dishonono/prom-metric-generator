const appInsights = require('applicationinsights');
const config = require('./config');


function useAppInsights() {
    appInsights.setup(config.appInsights.connectionString)
    .start();
}

function trackDependency(obj) {
    console.log('reporting dpendency tracking:', obj)
    appInsights.defaultClient.trackDependency(obj);
}


module.exports = { useAppInsights, trackDependency };


