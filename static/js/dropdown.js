const servCt = document.querySelector('.service-center-item');
const servCtDetail = document.querySelector('.service-center-detail');

const allCategory = document.querySelector('.all-category');
const allCategoryList = document.querySelector('.all-category-item');
const subCategoryList = document.querySelector('.sub-category-menu');
const navCloseBtn = document.querySelector('.navbar-close');

//pc ver.
function showServiceCenter() {
  servCt.addEventListener('mouseover', () => {
    servCtDetail.classList.add('show');
  });

  servCt.addEventListener('mouseout', () => {
    servCtDetail.classList.remove('show');
  });
}

function showAllMenu() {
  allCategory.addEventListener('mouseover', () => {
    allCategoryList.style.display = 'block';
  });

  allCategory.addEventListener('mouseout', () => {
    allCategoryList.addEventListener('mouseover', () => {
      allCategoryList.style.display = 'block';
    });

    allCategoryList.addEventListener('mouseout', () => {
      allCategoryList.style.display = 'none';
    });
  });
}

//mobile ver.
function spreadSubMenu(sub) {
  if (sub.classList.contains('on')) {
    sub.style.maxHeight = 0;
    sub.style.opacity = 0;
    sub.style.visibility = 'hidden';
    sub.classList.remove('on');
  } else {
    sub.style.maxHeight = 'max-content';
    sub.style.opacity = 1;
    sub.style.visibility = 'visible';
    sub.classList.add('on');
  }
}

if (window.innerWidth <= 768) {
  allCategory.addEventListener('click', () => {
    allCategoryList.classList.add('side-bar');
    navCloseBtn.classList.add('close-button');
  });

  navCloseBtn.addEventListener('click', () => {
    allCategoryList.classList.remove('side-bar');
    navCloseBtn.classList.remove('close-button');
  });

  allCategoryList.addEventListener('click', (event) => {
    if (event.target.className == 'vegetable') {
      const sub = document.querySelector('.sub-vegetable');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'fruit') {
      const sub = document.querySelector('.sub-fruit');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'fish') {
      const sub = document.querySelector('.sub-fish');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'meat') {
      const sub = document.querySelector('.sub-meat');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'soup') {
      const sub = document.querySelector('.sub-soup');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'salad') {
      const sub = document.querySelector('.sub-salad');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'sauce') {
      const sub = document.querySelector('.sub-sauce');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'drink') {
      const sub = document.querySelector('.sub-drink');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'snack') {
      const sub = document.querySelector('.sub-snack');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'deli') {
      const sub = document.querySelector('.sub-deli');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'health') {
      const sub = document.querySelector('.sub-health');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'living') {
      const sub = document.querySelector('.sub-living');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'beauty') {
      const sub = document.querySelector('.sub-beauty');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'kitchen') {
      const sub = document.querySelector('.sub-kitchen');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'appliance') {
      const sub = document.querySelector('.sub-appliance');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'kids') {
      const sub = document.querySelector('.sub-kids');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'pet') {
      const sub = document.querySelector('.sub-pet');
      spreadSubMenu(sub);
    }
    if (event.target.className == 'recommend') {
      const sub = document.querySelector('.sub-recommend');
      spreadSubMenu(sub);
    }
  });
} else {
  showAllMenu();
  showServiceCenter();
}
