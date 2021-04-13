function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}

function initializeClock(id, endtime) {
  const clock = document.getElementById(id);
  const daysSpan = clock.querySelector('.days');
  const hoursSpan = clock.querySelector('.hours');
  const minutesSpan = clock.querySelector('.minutes');
  const secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    const t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  const timeinterval = setInterval(updateClock, 1000);
}

const deadline = new Date('April 12, 2022');

function start() {
  initializeClock('clockdiv', deadline);

  fetch(`https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=1618275000&to=${Math.round(+new Date()/1000)}`)
  .then(response => response.json())
  .then(ethData => {
      fetch(`https://api.coingecko.com/api/v3/coins/binancecoin/market_chart/range?vs_currency=usd&from=1618275000&to=${Math.round(+new Date()/1000)}`)
      .then(response => response.json())
      .then(binanceData => {
        const ethStart = ethData.prices[0][1]
        const ethEnd = ethData.prices[ethData.prices.length - 1][1]
        const ethDelta = -100 * ( (ethStart - ethEnd) / ( (ethStart+ethEnd)/2 ) );

        const bnbStart = binanceData.prices[0][1]
        const bnbEnd = binanceData.prices[binanceData.prices.length - 1][1]
        const bnbDelta = -100 * ( (bnbStart - bnbEnd) / ( (bnbStart+bnbEnd)/2 ) );

        const winner = (ethDelta>bnbDelta)?'mike':'brett'
        document.getElementById(`${winner}_winning`).style.background = 'limegreen'
        document.getElementById(`${winner}_winning`).querySelector('.confetti').style.display = 'block'
        document.getElementById('winner_name').innerHTML = winner
        document.getElementById('token_prices').innerHTML = `
          (
            ${bnbDelta>0?'+':''}${bnbDelta.toFixed(2)}% BNB vs.
            ${ethDelta>0?'+':''}${ethDelta.toFixed(2)}% ETH
          )
        `;
      });
  });
}