const header = document.querySelector('.header')
const toggleBtn = document.querySelector('.header__toggle')

const toggleHeader = e => {
  e.preventDefault()
  header.classList.toggle('open')
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', toggleHeader)
}
