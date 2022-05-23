const slide = document.querySelector('.slide');
const slideList = document.querySelector('.slide-items');
const slideContents = document.querySelectorAll('.slide-content');
const slideBtns = document.querySelector('.button-direction');
const slideBtnPrev = document.querySelector('.prev-button');
const slideBtnNext = document.querySelector('.next-button');

const slideLen = slideContents.length;
const slideWidth = 1700;
const slideSpeed = 300;
const startNum = 0;

const firstChild = slideList.firstElementChild;
const lastChild = slideList.lastElementChild;
const clonedFirst = firstChild.cloneNode(true);
const clonedLast = lastChild.cloneNode(true);

let isPause = false;
let interval;

slideList.style.width = slideWidth * (slideLen + 2) + 'px';

slideList.appendChild(clonedFirst);
slideList.insertBefore(clonedLast, slideList.firstElementChild);
slideList.style.transform =
  'translate3d(-' + slideWidth * (startNum + 1) + 'px, 0, 0)';
let curIndex = startNum;
let curSlide = slideContents[curIndex]; // current slide dom
curSlide.classList.add('slide_active');

function moveSlide() {
  interval = setInterval(() => {
    if (curIndex <= slideLen - 1) {
      slideList.style.transition = slideSpeed + 'ms';
      slideList.style.transform =
        'translate3d(-' + slideWidth * (curIndex + 2) + 'px, 0px, 0px)';
    }
    //마지막 슬라이드일 때
    if (curIndex === slideLen - 1) {
      setTimeout(() => {
        slideList.style.transition = '0ms';
        slideList.style.transform =
          'translate3d(-' + slideWidth + 'px, 0px, 0px)'; //1번 슬라이드가 보이게 한다
      }, slideSpeed);
      curIndex = -1; //돌아오는 첫번째 슬라이드를 0으로 만들어주기 위해서
    }
    curSlide.classList.remove('slide_active');
    curSlide = slideContents[++curIndex];
    curSlide.classList.add('slide_active');
  }, 4000);
}

function handleSlideBtn() {
  slideBtnNext.addEventListener('click', () => {
    //0~4 슬라이드까지
    if (curIndex <= slideLen - 1) {
      slideList.style.transition = slideSpeed + 'ms';
      slideList.style.transform =
        'translate3d(-' + slideWidth * (curIndex + 2) + 'px, 0px, 0px)';
    }
    //마지막 슬라이드일 때
    if (curIndex === slideLen - 1) {
      setTimeout(() => {
        slideList.style.transition = '0ms';
        slideList.style.transform =
          'translate3d(-' + slideWidth + 'px, 0px, 0px)'; //1번 슬라이드가 보이게 한다
      }, slideSpeed);
      curIndex = -1; //돌아오는 첫번째 슬라이드를 0으로 만들어주기 위해서
    }
    curSlide.classList.remove('slide_active');
    curSlide = slideContents[++curIndex];
    curSlide.classList.add('slide_active');
  });

  // Prev Button Event(이전버튼)
  slideBtnPrev.addEventListener('click', () => {
    if (curIndex >= 0) {
      slideList.style.transition = slideSpeed + 'ms';
      slideList.style.transform =
        'translate3d(-' + slideWidth * curIndex + 'px, 0px, 0px)';
    }
    //첫번째 슬라이드일 때
    if (curIndex === 0) {
      setTimeout(() => {
        slideList.style.transition = '0ms';
        slideList.style.transform =
          'translate3d(-' + slideWidth * slideLen + 'px, 0px, 0px)'; //5번 슬라이드가 보이게 한다
      }, slideSpeed);
      curIndex = slideLen;
    }
    curSlide.classList.remove('slide_active');
    curSlide = slideContents[--curIndex]; //length로는 5이지만 index는 4이기 때문
    curSlide.classList.add('slide_active');
  });
}

function stopSlide() {
  slide.addEventListener('mouseover', () => {
    if (isPause === false) {
      clearInterval(interval);
      isPause = !isPause;
    }
    slideBtns.style.opacity = 1;
  });

  slide.addEventListener('mouseleave', () => {
    if (isPause === true) {
      moveSlide();
      isPause = !isPause;
    }
    slideBtns.style.opacity = 0;
  });
}

stopSlide();
moveSlide();
handleSlideBtn();
