const mdCategoryList = document.querySelector('.md-category-items');
const moreProduct = document.querySelector('.more-product-link');

function changeCategory(text) {
  const mdList = document.querySelector('.md-items');
  mdList.scrollIntoView({ behavior: 'smooth' });
  moreProduct.innerHTML = `
  ${text} 전체보기             
  <button type="button" class="more-arrow"></button>
  `;
}

mdCategoryList.addEventListener('click', (event) => {
  if (event.target.className == 'md-vege') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-fruit') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-fish') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-meat') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-soup') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-salad') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-sauce') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-drink') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-snack') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-deli') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-health') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-living') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-beauty') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-kitchen') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-appliance') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-kids') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
  if (event.target.className == 'md-pet') {
    const text = event.target.innerHTML;
    changeCategory(text);
  }
});
