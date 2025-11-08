const slides = document.querySelectorAll(".slider__item");
const indicators = document.querySelectorAll(".slider__indicator");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

let index = 0;

function showSlide(i) {
  slides.forEach(slide => slide.classList.remove("active"));
  indicators.forEach(dot => dot.classList.remove("active"));

  slides[i].classList.add("active");
  indicators[i].classList.add("active");
}

// кнопки
next.addEventListener("click", () => {
  index = (index + 1) % slides.length;
  showSlide(index);
});

prev.addEventListener("click", () => {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
});

// индикаторы кликабельные (если хочешь)
indicators.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    index = i;
    showSlide(index);
  });
});

// старт
showSlide(index);
