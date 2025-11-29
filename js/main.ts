import type { Coffee } from './types.js';
import type { ApiProduct } from './types.js';
import { initI18n } from './i18n.js';


window.addEventListener('DOMContentLoaded', async () => {
  const sliderTrack = document.querySelector('.slider__track') as HTMLElement | null;
  const prevBtn = document.querySelector('.slider__btn--prev') as HTMLElement | null;
  const nextBtn = document.querySelector('.slider__btn--next') as HTMLElement | null;
  const dotsContainer = document.querySelector('.slider__dots') as HTMLElement | null;
   initI18n();

  if (!sliderTrack) {
    console.error('❌ .slider__track not found in HTML');
    return;
  }

  const loaderHTML = '<div class="loader"></div>';
  sliderTrack.innerHTML = loaderHTML;

  async function fetchFavorites(): Promise<Coffee[]> {
    const response = await fetch(
      'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/favorites',
      { headers: { Accept: 'application/json' } }
    );

    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const json = await response.json();
    const data = json.data || [];

    return data.map((item: ApiProduct) => ({
      id: String(item.id),
      name: item.name,
      description: item.description,
     price: parseFloat(String(item.price)),
      discountPrice: item.discountPrice ? parseFloat(String(item.discountPrice)) : undefined,
      imageUrl: `assets/images/${item.name.toLowerCase().replace(/\s+/g, '-')}.png`,
    }));
  }

  function renderSlides(coffees: Coffee[]): void {
    if (!sliderTrack) return;

    sliderTrack.innerHTML = coffees
      .map(
        (item, i) => `
        <div class="slider__item ${i === 0 ? 'active' : ''}">
          <img src="${item.imageUrl}" alt="${item.name}" />
          <h3 class="slider__name">${item.name}</h3>
          <p class="slider__desc">${item.description}</p>
          <span class="slider__price">$${item.price.toFixed(2)}</span>
        </div>`
      )
      .join('');

    if (dotsContainer) {
      dotsContainer.innerHTML = coffees
        .map(
          (_, i) =>
            `<span class="slider__dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
        )
        .join('');
    }
  }

  function setupSlider() {
    const slides = document.querySelectorAll('.slider__item');
    const dots = document.querySelectorAll('.slider__dot');
    let current = 0;

    if (slides.length === 0) return;

    function updateSlider(newIndex: number) {
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      current = (newIndex + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
    }

    prevBtn?.addEventListener('click', () => updateSlider(current - 1));
    nextBtn?.addEventListener('click', () => updateSlider(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => updateSlider(i)));
  }

  try {
    const coffees = await fetchFavorites();
    renderSlides(coffees);
    setupSlider();
  } catch (err) {
    console.error('Slider error:', err);
    sliderTrack.innerHTML = '<p class="error">Something went wrong. Please, refresh the page.</p>';
  }
});
