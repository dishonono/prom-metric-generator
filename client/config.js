module.exports = {
    serverUrl: 'http://web:3000',
    methodFailureRates: [
       { method: 'Get', failureRate: 0.2, httpMethod: 'GET', path: '/'},
       { method: 'Put', failureRate: 0.04, httpMethod: 'PUT', path: '/' },
       { method: 'List', failureRate: 0.05, httpMethod: 'GET', path: '/list' },
       { method: 'Settings', failureRate: 0.008, httpMethod: 'GET', path: '/settings' },
    ],
    dependencyLatencies: [
        { duration: 2000, target: "http://users-db", name: 'Users', data: 'SELECT * FROM Users', success: true, dependencyTypeName : 'ZQL'},
        { duration: 400, target: "http://settings-db", name: 'Settings', data: 'SELECT * FROM Settings', success: true, dependencyTypeName : 'ZQL'}
    ],
    sleepPeriod: 500,
    dependencyLatenctVariance: 0.1
}