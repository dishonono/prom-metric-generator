module.exports = {
    serverUrl: 'http://web:3000',
    methodFailureRates: [
       { method: 'Get', failureRate: 0.2, httpMethod: 'GET1', path: '/'},
       { method: 'Put', failureRate: 0.04, httpMethod: 'PUT1', path: '/' },
       { method: 'List', failureRate: 0.05, httpMethod: 'GET1', path: '/list' },
       { method: 'Settings', failureRate: 0.008, httpMethod: 'GET1', path: '/settings' },
    ],
    dependencyLatencies: [
        { duration: 2000, target: "http://users1-db", name: 'Users1', data: 'SELECT * FROM Users', success: true, dependencyTypeName : 'ZQL'},
        { duration: 400, target: "http://settings1-db", name: 'Settings1', data: 'SELECT * FROM Settings', success: true, dependencyTypeName : 'ZQL'}
    ],
    sleepPeriod: 500,
    dependencyLatenctVariance: 0.1
}