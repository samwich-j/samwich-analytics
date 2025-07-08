const body = document.body;
const logoImage = document.getElementById('logo-image');
const btnThemeIcon = document.getElementById('btn-theme');
const btnHamburger = document.querySelector('.fa-bars');

const addThemeClass = (bodyClass, iconClass) => {
  body.classList.add(bodyClass);
  btnThemeIcon.classList.add(iconClass);
  updateLogo();
};

const getBodyTheme = localStorage.getItem('portfolio-theme') || 'light';
const getIconTheme = localStorage.getItem('portfolio-icon-theme') || 'fa-moon';

addThemeClass(getBodyTheme, getIconTheme);

const isDark = () => body.classList.contains('dark');

const setTheme = (bodyClass, iconClass) => {
  body.classList.remove('light', 'dark');
  btnThemeIcon.classList.remove('fa-moon', 'fa-sun');

  addThemeClass(bodyClass, iconClass);

  localStorage.setItem('portfolio-theme', bodyClass);
  localStorage.setItem('portfolio-icon-theme', iconClass);
};

const updateLogo = () => {
  if (!logoImage) return;
  logoImage.src = isDark()
    ? 'assets/logos/Logo-dark.png'
    : 'assets/logos/Logo-light.png';
};

const toggleTheme = () => {
  if (isDark()) {
    setTheme('light', 'fa-moon');
  } else {
    setTheme('dark', 'fa-sun');
  }
};

btnThemeIcon.addEventListener('click', toggleTheme);

const displayList = () => {
	const navUl = document.querySelector('.nav__list')

	if (btnHamburger.classList.contains('fa-bars')) {
		btnHamburger.classList.remove('fa-bars')
		btnHamburger.classList.add('fa-times')
		navUl.classList.add('display-nav-list')
	} else {
		btnHamburger.classList.remove('fa-times')
		btnHamburger.classList.add('fa-bars')
		navUl.classList.remove('display-nav-list')
	}
}

btnHamburger.addEventListener('click', displayList)

const scrollUp = () => {
	const btnScrollTop = document.querySelector('.scroll-top')

	if (
		body.scrollTop > 500 ||
		document.documentElement.scrollTop > 500
	) {
		btnScrollTop.style.display = 'block'
	} else {
		btnScrollTop.style.display = 'none'
	}
}

document.addEventListener('scroll', scrollUp)
