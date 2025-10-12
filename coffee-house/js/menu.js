const menuGrid = document.getElementById("menuItems");
const tabs = document.querySelectorAll(".tab-item");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let products = [];
let currentCategory = "coffee";
let visibleCount = window.innerWidth <= 768 ? 4 : 8;

// Загружаем JSON
fetch("assets/data/products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts();
  })
  .catch(err => console.error("Ошибка загрузки JSON:", err));

function renderProducts() {
  const filtered = products.filter(p => p.category === currentCategory);
  const visible = filtered.slice(0, visibleCount);

  menuGrid.innerHTML = visible
    .map(
      p => `
        <div class="menu-card">
          <img src="assets/images/${p.name.toLowerCase().replace(/\s+/g, "-")}.png" alt="${p.name}">
          <div class="menu-card__info">
            <h3 class="menu-card__name">${p.name}</h3>
            <p class="menu-card__desc">${p.description}</p>
            <span class="menu-card__price">$${p.price}</span>
          </div>
        </div>
      `
    )
    .join("");

  loadMoreBtn.style.display =
    filtered.length > visibleCount && window.innerWidth <= 768 ? "block" : "none";
}

// Переключение категорий
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentCategory = tab.textContent.trim().toLowerCase();
    visibleCount = window.innerWidth <= 768 ? 4 : 8;
    renderProducts();
  });
});

// Load more
loadMoreBtn.addEventListener("click", () => {
  visibleCount += 4;
  renderProducts();
});

// Перестраиваем при изменении ширины
window.addEventListener("resize", () => {
  visibleCount = window.innerWidth <= 768 ? 4 : 8;
  renderProducts();
});









