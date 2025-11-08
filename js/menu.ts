import type { Coffee } from './types.js';

const menuGrid = document.getElementById('menuItems') as HTMLElement;
const tabs = document.querySelectorAll('.tab-item');
const loadMoreBtn = document.getElementById('loadMoreBtn') as HTMLButtonElement;

let products: Coffee[] = [];
let currentCategory = 'coffee';
let visibleCount = window.innerWidth <= 768 ? 4 : 8;

// === Получение данных с API ===
async function fetchProducts(): Promise<Coffee[]> {
  const response = await fetch('https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products', {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to load menu data (${response.status})`);
  }

  const json = await response.json();
  const data = Array.isArray(json) ? json : json.data;

  if (!Array.isArray(data)) {
    throw new Error('Invalid API response');
  }

  return data.map((item: any) => ({
    id: String(item.id),
    name: item.name,
    description: item.description || 'Freshly brewed and delightful.',
    price: parseFloat(item.price),
    discountPrice: item.discountPrice ? parseFloat(item.discountPrice) : undefined,
    category: item.category?.toLowerCase() || 'coffee',
    imageUrl: `assets/images/${item.name.toLowerCase().replace(/\s+/g, '-')}.png`,
  }));
}

// === Рендер карточек ===
function renderProducts(): void {
  const filtered = products.filter((p) => p.category === currentCategory);
  const visible = filtered.slice(0, visibleCount);

  if (visible.length === 0) {
    menuGrid.innerHTML = `<p class="error">No products found for "${currentCategory}".</p>`;
    return;
  }

  menuGrid.innerHTML = visible
    .map(
      (p) => `
        <div class="menu-card" data-id="${p.id}">
          <img src="${p.imageUrl}" alt="${p.name}">
          <div class="menu-card__info">
            <h3 class="menu-card__name">${p.name}</h3>
            <p class="menu-card__desc">${p.description}</p>
            ${
              p.discountPrice
                ? `<span class="menu-card__price menu-card__price--old">$${p.price.toFixed(
                    2
                  )}</span>
                   <span class="menu-card__price menu-card__price--new">$${p.discountPrice.toFixed(2)}</span>`
                : `<span class="menu-card__price">$${p.price.toFixed(2)}</span>`
            }
          </div>
        </div>`
    )
    .join('');

  loadMoreBtn.style.display =
    filtered.length > visibleCount && window.innerWidth <= 768 ? 'block' : 'none';
}

// === Переключение категорий ===
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    currentCategory = tab.textContent?.trim().toLowerCase() || 'coffee';
    visibleCount = window.innerWidth <= 768 ? 4 : 8;
    renderProducts();
  });
});

// === Load More ===
loadMoreBtn.addEventListener('click', () => {
  visibleCount += 4;
  renderProducts();
});

// === при изменении ширины ===
window.addEventListener('resize', () => {
  visibleCount = window.innerWidth <= 768 ? 4 : 8;
  renderProducts();
});

// === Инициализация ===
window.addEventListener('DOMContentLoaded', async () => {
  try {
    menuGrid.innerHTML = '<div class="loader"></div>';
    products = await fetchProducts();
    renderProducts();
  } catch (error) {
    console.error('Ошибка API:', error);
    menuGrid.innerHTML = '<p class="error">Something went wrong. Please, refresh the page.</p>';
  }
});
