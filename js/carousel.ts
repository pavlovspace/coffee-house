function initCarousel(): void {
  const slides = document.querySelectorAll('.slider__item');
  const indicators = document.querySelectorAll('.slider__indicator');
  const next = document.querySelector('.next') as HTMLButtonElement | null;
  const prev = document.querySelector('.prev') as HTMLButtonElement | null;

  if (slides.length === 0) return; // карточек ещё нет

  let index = 0;

  function showSlide(i: number): void {
    slides.forEach((slide) => slide.classList.remove('active'));
    indicators.forEach((dot) => dot.classList.remove('active'));

    slides[i].classList.add('active');
    if (indicators[i]) indicators[i].classList.add('active');
  }

  function nextSlide(): void {
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  function prevSlide(): void {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  }

  next?.addEventListener('click', nextSlide);
  prev?.addEventListener('click', prevSlide);

  indicators.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      index = i;
      showSlide(index);
    });
  });

  showSlide(index);
}

// Ждём появления слайдов после подгрузки данных
window.addEventListener('DOMContentLoaded', () => {
  const sliderTrack = document.querySelector('.slider__track');

  if (!sliderTrack) return;

  // наблюдаем за появлением слайдов
  const observer = new MutationObserver(() => {
    const slides = document.querySelectorAll('.slider__item');
    if (slides.length > 0) {
      initCarousel();
      observer.disconnect(); // инициализация только один раз
    }
  });

  observer.observe(sliderTrack, { childList: true });
});
