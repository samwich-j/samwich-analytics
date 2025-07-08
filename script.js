const body = document.body

const logoImage = document.getElementById('logo-image')

// ✅ Updated theme button & icon targeting
const btnTheme = document.getElementById('theme-toggle')
const themeIcon = btnTheme.querySelector('i')

const btnHamburger = document.querySelector('.fa-bars')

const addThemeClass = (bodyClass, btnIconClass) => {
  body.classList.add(bodyClass)
  themeIcon.classList.add(btnIconClass)
  updateLogo()
}

const getBodyTheme = localStorage.getItem('portfolio-theme') || 'light'
const getBtnTheme = localStorage.getItem('portfolio-btn-theme') || 'fa-moon'

addThemeClass(getBodyTheme, getBtnTheme)

const isDark = () => body.classList.contains('dark')

const setTheme = (bodyClass, btnIconClass) => {
  body.classList.remove(localStorage.getItem('portfolio-theme'))
  themeIcon.classList.remove(localStorage.getItem('portfolio-btn-theme'))

  addThemeClass(bodyClass, btnIconClass)

  localStorage.setItem('portfolio-theme', bodyClass)
  localStorage.setItem('portfolio-btn-theme', btnIconClass)

  updateLogo()
}

const updateLogo = () => {
  if (!logoImage) return
  logoImage.src = isDark()
    ? 'assets/logos/Logo-dark.png'
    : 'assets/logos/Logo-light.png'
}

const toggleTheme = () =>
  isDark() ? setTheme('light', 'fa-moon') : setTheme('dark', 'fa-sun')

btnTheme.addEventListener('click', toggleTheme)

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
