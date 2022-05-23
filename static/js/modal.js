const modal = document.querySelector('.promotion-modal');
const closeBtn = document.querySelector('.promotion-close');

closeBtn.addEventListener('click', () => {
  modal.style.animation = 'hide 2000ms ease';
  setTimeout(() => {
    modal.style.height = 0;
  }, 1900);
});
