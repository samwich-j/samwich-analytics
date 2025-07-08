const body = document.body;

const btnTheme = document.getElementById('theme-toggle'); // Use button ID, not just icon
const btnHamburger = document.querySelector('.fa-bars');

// Apply saved theme on page load
const getBodyTheme = localStorage.getItem('portfolio-theme');
const getBtnTheme = localStorage.getItem('portfolio-btn-theme');

if (getBodyTheme && getBtnTheme) {
  body.classList.add(getBodyTheme);
  btnTheme.firstElementChild.classList.add(getBtnTheme);
}

// Check if dark mode is active
const isDark = () => body.classList.contains('dark');

// Set and store the theme
const setTheme = (bodyClass, btnClass) => {
  const currentTheme = localStorage.getItem('portfolio-theme');
  const currentBtnClass = localStorage.getItem('portfolio-btn-theme');

  if (currentTheme) body.classList.remove(currentTheme);
  if (currentBtnClass) btnTheme.firstElementChild.classList.remove(currentBtnClass);

  body.classList.add(bodyClass);
  btnTheme.firstElementChild.classList.add(btnClass);

  localStorage.setItem('portfolio-theme', bodyClass);
  localStorage.setItem('portfolio-btn-theme', btnClass);
};

// Toggle light/dark theme
const toggleTheme = () => {
  isDark() ? setTheme('light', 'fa-moon') : setTheme('dark', 'fa-sun');
};

btnTheme.addEventListener('click', toggleTheme);

// Toggle mobile nav
const displayList = () => {
  const navUl = document.querySelector('.nav__list');

  if (btnHamburger.classList.contains('fa-bars')) {
    btnHamburger.classList.remove('fa-bars');
    btnHamburger.classList.add('fa-times');
    navUl.classList.add('display-nav-list');
  } else {
    btnHamburger.classList.remove('fa-times');
    btnHamburger.classList.add('fa-bars');
    navUl.classList.remove('display-nav-list');
  }
};

btnHamburger.addEventListener('click', displayList);

// Show/hide scroll-to-top button
const scrollUp = () => {
  const btnScrollTop = document.querySelector('.scroll-top');

  if (
    body.scrollTop > 500 ||
    document.documentElement.scrollTop > 500
  ) {
    btnScrollTop.style.display = 'block';
  } else {
    btnScrollTop.style.display = 'none';
  }
};

document.addEventListener('scroll', scrollUp);
