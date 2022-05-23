const chPrevBtn = document.querySelector('.cheap-prev-button');
const chNextBtn = document.querySelector('.cheap-next-button');

const mdPrevBtn = document.querySelector('.md-prev-button');
const mdNextBtn = document.querySelector('.md-next-button');

const newPrevBtn = document.querySelector('.new-prev-button');
const newNextBtn = document.querySelector('.new-next-button');

const populPrevBtn = document.querySelector('.popular-prev-button');
const populNextBtn = document.querySelector('.popular-next-button');

const mustPrevBtn = document.querySelector('.must-prev-button');
const mustNextBtn = document.querySelector('.must-next-button');

const offlnPrevBtn = document.querySelector('.offline-prev-button');
const offlnNextBtn = document.querySelector('.offline-next-button');

const recipePrevBtn = document.querySelector('.recipe-prev-button');
const recipeNextBtn = document.querySelector('.recipe-next-button');

const cheapList = document.querySelector('.cheap-items');
const mdList = document.querySelector('.md-items');
const newList = document.querySelector('.new-items');
const popularList = document.querySelector('.popular-items');
const mustList = document.querySelector('.must-items');
const offlineList = document.querySelector('.offline-items');
const recipeList = document.querySelector('.recipe-items');

let hSlideWidth = (cheapList.clientWidth / 6) * 2;
let recipeWidth = (recipeList.clientWidth / 5) * 2;

let counter;

function onNextBtn(prev, next, list, width) {
  counter = 0;

  prev.style.display = 'block';
  next.style.display = 'none';
  list.style.transition = 'transform 0.5s ease-in-out';
  counter++;
  list.style.transform = 'translateX(' + -width * counter + 'px)';
}

function onPrevBtn(prev, next, list, width) {
  counter = 1;

  prev.style.display = 'none';
  next.style.display = 'block';
  list.style.transition = 'transform 0.5s ease-in-out';
  counter--;
  list.style.transform = 'translateX(' + -width * counter + 'px)';
}

function onChBtn() {
  chNextBtn.addEventListener('click', () => {
    onNextBtn(chPrevBtn, chNextBtn, cheapList, hSlideWidth);
  });

  chPrevBtn.addEventListener('click', () => {
    onPrevBtn(chPrevBtn, chNextBtn, cheapList, hSlideWidth);
  });
}

function onMdBtn() {
  mdNextBtn.addEventListener('click', () => {
    onNextBtn(mdPrevBtn, mdNextBtn, mdList, hSlideWidth);
  });

  mdPrevBtn.addEventListener('click', () => {
    onPrevBtn(mdPrevBtn, mdNextBtn, mdList, hSlideWidth);
  });
}

function onNewBtn() {
  newNextBtn.addEventListener('click', () => {
    onNextBtn(newPrevBtn, newNextBtn, newList, hSlideWidth);
  });

  newPrevBtn.addEventListener('click', () => {
    onPrevBtn(newPrevBtn, newNextBtn, newList, hSlideWidth);
  });
}

function onPopularBtn() {
  populNextBtn.addEventListener('click', () => {
    onNextBtn(populPrevBtn, populNextBtn, popularList, hSlideWidth);
  });

  populPrevBtn.addEventListener('click', () => {
    onPrevBtn(populPrevBtn, populNextBtn, popularList, hSlideWidth);
  });
}

function onMustBtn() {
  mustNextBtn.addEventListener('click', () => {
    onNextBtn(mustPrevBtn, mustNextBtn, mustList, hSlideWidth);
  });

  mustPrevBtn.addEventListener('click', () => {
    onPrevBtn(mustPrevBtn, mustNextBtn, mustList, hSlideWidth);
  });
}

function onOfflnBtn() {
  offlnNextBtn.addEventListener('click', () => {
    onNextBtn(offlnPrevBtn, offlnNextBtn, offlineList, hSlideWidth);
  });

  offlnPrevBtn.addEventListener('click', () => {
    onPrevBtn(offlnPrevBtn, offlnNextBtn, offlineList, hSlideWidth);
  });
}

function onRecipeBtn() {
  recipeNextBtn.addEventListener('click', () => {
    onNextBtn(recipePrevBtn, recipeNextBtn, recipeList, recipeWidth);
  });

  recipePrevBtn.addEventListener('click', () => {
    onPrevBtn(recipePrevBtn, recipeNextBtn, recipeList, recipeWidth);
  });
}

function init() {
  onChBtn();
  onMdBtn();
  onNewBtn();
  onPopularBtn();
  onMustBtn();
  onOfflnBtn();
  onRecipeBtn();
}

init();
