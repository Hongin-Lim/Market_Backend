const quickMenu = document.querySelector('.quick-menu');
const pageTopBtn = document.querySelector('.page-top-button');

const quickMenuHeight = 527;

function onScroll() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > quickMenuHeight) {
      let top = window.scrollY + quickMenuHeight / 2 - 100;
      quickMenu.style.top = top + 'px';
    } else {
      quickMenu.style.top = quickMenuHeight + 'px';
    }

    if (window.scrollY > 1000) {
      pageTopBtn.style.opacity = 1;
      pageTopBtn.style.transition = 'all 0.5s ease-in-out';
    } else {
      pageTopBtn.style.opacity = 0;
    }
  });
}

function movetoTop() {
  pageTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function init() {
  onScroll();
  movetoTop();
}

init();
