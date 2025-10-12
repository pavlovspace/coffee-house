// modal ==================================================================================

const modal = document.getElementById("productModal");
const modalImage = modal.querySelector(".modal__image");
const modalTitle = modal.querySelector(".modal__title");
const modalDesc = modal.querySelector(".modal__desc");
const modalPrice = modal.querySelector(".modal__price");
const modalClose = modal.querySelector(".modal__btn");
const overlay = modal.querySelector(".modal__overlay");

let basePrice = 0;

// === ОТКРЫТИЕ МОДАЛКИ ===
document.addEventListener("click", e => {
  const card = e.target.closest(".menu-card");
  if (card) {
    const name = card.querySelector(".menu-card__name").textContent;
    const desc = card.querySelector(".menu-card__desc").textContent;
    const price = parseFloat(card.querySelector(".menu-card__price").textContent.replace("$", ""));
    const img = card.querySelector("img").src;

    basePrice = price;
    modalImage.src = img;
    modalTitle.textContent = name;
    modalDesc.textContent = desc;
    modalPrice.textContent = `$${basePrice.toFixed(2)}`;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    resetOptions();
    updateTotal();
  }
});

// === ЗАКРЫТИЕ ===
[modalClose, overlay].forEach(el =>
  el.addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  })
);

// === ФУНКЦИЯ СБРОСА ===
function resetOptions() {
  modal.querySelectorAll(".option").forEach(btn => btn.classList.remove("active"));
  // Активный размер — S
  modal.querySelector(".modal__sizes .option[data-add='0.00']").classList.add("active");
}

// === ВЫБОР РАЗМЕРА ===
modal.querySelectorAll(".modal__sizes .option").forEach(btn => {
  btn.addEventListener("click", () => {
    modal.querySelectorAll(".modal__sizes .option").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    updateTotal();
  });
});

// === ВЫБОР ДОБАВОК ===
modal.querySelectorAll(".modal__additives .option").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    updateTotal();
  });
});

// === ПЕРЕСЧЁТ ИТОГА ===
function updateTotal() {
  const sizeAdd = parseFloat(
    modal.querySelector(".modal__sizes .option.active")?.dataset.add || "0"
  );
  const addAdditives = Array.from(
    modal.querySelectorAll(".modal__additives .option.active")
  ).reduce((sum, btn) => sum + parseFloat(btn.dataset.add), 0);

  const total = basePrice + sizeAdd + addAdditives;
  modalPrice.textContent = `$${total.toFixed(2)}`;
}




