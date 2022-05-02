const config = require('./config');
const { generateUniformMetricValue, sleep } = require('./utils');
const axios = require('axios');


const { serverUrl, methodFailureRates, dependencyLatencies, dependencyLatenctVariance, sleepPeriod } = config;
let iteration = 1;

async function main() {
    while (true) {
        const httpfailureRequests = Object.keys(methodFailureRates).map(async method => {
            const value = methodFailureRates[method];
            const body = {
                path: value.path,
                method: value.httpMethod,
                statusCode: Math.random() < value.failureRate ? 500 : 200
            }
            return axios.post(`${serverUrl}/failures`, body);
        });

        await Promise.all(httpfailureRequests).catch( error => {
            console.log('something went wrong', error);
        });

        const dependencyLatencyRequests = Object.keys(dependencyLatencies).map(async dependency => {
            const body = {
                name: dependency,
                latency: generateUniformMetricValue(dependencyLatencies[dependency], dependencyLatenctVariance)
            }
            return axios.post(`${serverUrl}/dependencies`, body);
        });

        await Promise.all(dependencyLatencyRequests).catch(error => {
            console.log('something went wrong', error);
        });

        console.log(`finished iteration number ${iteration}, sleeping for ${sleepPeriod} milliseconds`);
        iteration += 1;

        await sleep(sleepPeriod);
    }
}

main();