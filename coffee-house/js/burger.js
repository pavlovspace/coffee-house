// burger ==================================================================================

const burgerIcon = document.getElementById('burgerIcon');
const burgerMenu = document.getElementById('burgerMenu');
const burgerClose = document.getElementById('burgerClose');

if (burgerIcon && burgerMenu && burgerClose) {
  // открыть меню
  burgerIcon.addEventListener('click', () => {
    burgerMenu.classList.add('open');
    burgerIcon.classList.add('hidden'); // прячем бургер
  });

  // закрыть меню
  burgerClose.addEventListener('click', () => {
    burgerMenu.classList.remove('open');
    burgerIcon.classList.remove('hidden'); // показываем обратно
  });
}
