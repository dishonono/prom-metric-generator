function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  //Retruns true with odds oddsForFalse
  //oddsForFalse must be a float between 0 and 1
  function getTrueByOdds(oddsForTrue) {
    return Math.random() < oddsForTrue;
  }

  const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

  module.exports  = { sleep, getTrueByOdds, getDurationInMilliseconds };