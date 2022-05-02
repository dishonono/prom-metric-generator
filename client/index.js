const config = require('./config');
const { generateUniformMetricValue, sleep } = require('./utils');
const axios = require('axios');


const { serverUrl, methodFailureRates, dependencyLatencies, dependencyLatenctVariance, sleepPeriod } = config;

async function reportHttpFailures() {
    const httpfailureRequests = methodFailureRates.map(async methodFailureRate => {
        const body = {
            path: methodFailureRate.path,
            method: methodFailureRate.httpMethod,
            statusCode: Math.random() < methodFailureRate.failureRate ? 500 : 200
        }
        return axios.post(`${serverUrl}/failures`, body);
    });

    await Promise.all(httpfailureRequests);
}

async function ReportdependencyLatencyMetrics() {
    const dependencyLatencyRequests = dependencyLatencies.map(async dependency => {
        const body = {
             duration: generateUniformMetricValue(dependency.duration, dependencyLatenctVariance),
             target: dependency.target,
             name: dependency.name,
             data: dependency.data,
             success: dependency.success,
             dependencyTypeName : dependency.dependencyTypeName
            };

        return axios.post(`${serverUrl}/dependencies`, body);
    });

    await Promise.all(dependencyLatencyRequests);
}


async function main() {
    let iteration = 1;

    while (true) {
        await Promise.all([reportHttpFailures(), ReportdependencyLatencyMetrics()])
        .catch(error => {
            console.log('something went wrong', error);
        });

        console.log(`finished iteration number ${iteration}, sleeping for ${sleepPeriod} milliseconds`);
        iteration += 1;

        await sleep(sleepPeriod);
    }
}

main();