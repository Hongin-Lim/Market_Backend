const saleTimer = document.querySelector('.sale-timer strong');

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

let timer;

function countDownTimer(dt) {
  const end = new Date(dt);

  function showRemaining() {
    const now = new Date();
    const distance = end - now;
    if (distance < 0) {
      clearInterval(timer);
      return;
    }
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    setHours = hours < 10 ? `0${hours}` : `${hours}`;
    setMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    setSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    saleTimer.innerText = `${setHours}:${setMinutes}:${setSeconds}`;
  }

  timer = setInterval(showRemaining, 1000);
}

countDownTimer('2030-12-19T00:00:00');
