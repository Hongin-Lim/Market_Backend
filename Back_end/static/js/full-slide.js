const recommendList = document.querySelector('.recommend-items');
const rcdPrevBtn = document.querySelector('.recommend-prev-button');
const rcdNextBtn = document.querySelector('.recommend-next-button');

const rcdSlideWidth = (recommendList.clientWidth / 20) * 4;
let rcdCounter = 0;

function onRcdNextBtn() {
  rcdNextBtn.addEventListener('click', () => {
    if (rcdCounter >= 4) {
      return;
    }
    if (rcdCounter === 3) {
      rcdNextBtn.style.display = 'none';
    }

    rcdPrevBtn.style.display = 'block';
    recommendList.style.transition = 'transform 0.5s ease-in-out';
    rcdCounter++;
    recommendList.style.transform =
      'translateX(' + -rcdSlideWidth * rcdCounter + 'px)';
  });
}

function onRcdPrevBtn() {
  rcdPrevBtn.addEventListener('click', () => {
    if (rcdCounter <= 0) {
      return;
    }
    if (rcdCounter === 1) {
      rcdPrevBtn.style.display = 'none';
    }

    rcdNextBtn.style.display = 'block';
    recommendList.style.transition = 'transform 0.5s ease-in-out';
    rcdCounter--;
    recommendList.style.transform =
      'translateX(' + -rcdSlideWidth * rcdCounter + 'px)';
  });
}

onRcdNextBtn();
onRcdPrevBtn();
