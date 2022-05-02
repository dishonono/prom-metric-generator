module.exports = {
    serverUrl: 'http://localhost:3000',
    methodFailureRates: {
        Get: { failureRate: 0.1, httpMethod: 'GET', path: '/'},
        Put: { failureRate: 0.01, httpMethod: 'PUT', path: '/' },
        List: { failureRate: 0.025, httpMethod: 'GET', path: '/list' },
        Settings: { failureRate: 0.003, httpMethod: 'GET', path: '/settings' },
    },
    dependencyLatencies: {
        Users: 50,
        Settings: 200
    },
    sleepPeriod: 500,
    dependencyLatenctVariance: 0.1
}