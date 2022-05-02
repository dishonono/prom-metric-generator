const { methodFailureRate } = require("./config");

function generateUniformDistributionValue(base, delta) {
    const offset = (Math.random() - 0.5) * delta;
    console.log(base + offset);
    return base + offset;
}

function generateUniformMetricValue(base, variance) {
    const delta = base * variance;
    return generateUniformDistributionValue(base, delta);
}


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

module.exports = { generateUniformMetricValue, sleep }