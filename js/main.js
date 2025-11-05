var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initI18n } from './i18n.js';
window.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const sliderTrack = document.querySelector('.slider__track');
    const prevBtn = document.querySelector('.slider__btn--prev');
    const nextBtn = document.querySelector('.slider__btn--next');
    const dotsContainer = document.querySelector('.slider__dots');
    initI18n();
    if (!sliderTrack) {
        console.error('❌ .slider__track not found in HTML');
        return;
    }
    const loaderHTML = `<div class="loader"></div>`;
    sliderTrack.innerHTML = loaderHTML;
    function fetchFavorites() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/favorites', { headers: { Accept: 'application/json' } });
            if (!response.ok)
                throw new Error(`Fetch failed: ${response.status}`);
            const json = yield response.json();
            const data = json.data || [];
            return data.map((item) => ({
                id: String(item.id),
                name: item.name,
                description: item.description,
                price: parseFloat(item.price),
                discountPrice: item.discountPrice ? parseFloat(item.discountPrice) : undefined,
                imageUrl: `assets/images/${item.name.toLowerCase().replace(/\s+/g, '-')}.png`,
            }));
        });
    }
    function renderSlides(coffees) {
        if (!sliderTrack)
            return;
        sliderTrack.innerHTML = coffees
            .map((item, i) => `
        <div class="slider__item ${i === 0 ? 'active' : ''}">
          <img src="${item.imageUrl}" alt="${item.name}" />
          <h3 class="slider__name">${item.name}</h3>
          <p class="slider__desc">${item.description}</p>
          <span class="slider__price">$${item.price.toFixed(2)}</span>
        </div>`)
            .join('');
        if (dotsContainer) {
            dotsContainer.innerHTML = coffees
                .map((_, i) => `<span class="slider__dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`)
                .join('');
        }
    }
    function setupSlider() {
        const slides = document.querySelectorAll('.slider__item');
        const dots = document.querySelectorAll('.slider__dot');
        let current = 0;
        if (slides.length === 0)
            return;
        function updateSlider(newIndex) {
            var _a, _b;
            slides[current].classList.remove('active');
            (_a = dots[current]) === null || _a === void 0 ? void 0 : _a.classList.remove('active');
            current = (newIndex + slides.length) % slides.length;
            slides[current].classList.add('active');
            (_b = dots[current]) === null || _b === void 0 ? void 0 : _b.classList.add('active');
        }
        prevBtn === null || prevBtn === void 0 ? void 0 : prevBtn.addEventListener('click', () => updateSlider(current - 1));
        nextBtn === null || nextBtn === void 0 ? void 0 : nextBtn.addEventListener('click', () => updateSlider(current + 1));
        dots.forEach((dot, i) => dot.addEventListener('click', () => updateSlider(i)));
    }
    try {
        const coffees = yield fetchFavorites();
        renderSlides(coffees);
        setupSlider();
    }
    catch (err) {
        console.error('Slider error:', err);
        sliderTrack.innerHTML = `<p class="error">Something went wrong. Please, refresh the page.</p>`;
    }
}));
