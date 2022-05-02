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

  module.exports  = { sleep, getTrueByOdds };