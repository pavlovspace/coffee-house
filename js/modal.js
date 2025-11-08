var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { addToCart, updateCartCounter } from './cart.js';
const modal = document.getElementById('productModal');
const modalImage = modal.querySelector('.modal__image');
const modalTitle = modal.querySelector('.modal__title');
const modalDesc = modal.querySelector('.modal__desc');
const modalPrice = modal.querySelector('.modal__price');
const modalClose = modal.querySelector('.modal__btn');
const overlay = modal.querySelector('.modal__overlay');
// === Кнопка Add to Cart ===
const addToCartBtn = document.createElement('button');
addToCartBtn.className = 'button-primary modal__add';
addToCartBtn.textContent = 'Add to Cart';
(_a = modal.querySelector('.modal__info')) === null || _a === void 0 ? void 0 : _a.appendChild(addToCartBtn);
let basePrice = 0;
let discountPrice = null;
// === Получение продукта по ID ===
function fetchProductById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/${id}`;
        try {
            const response = yield fetch(url, { headers: { Accept: 'application/json' } });
            const json = yield response.json();
            const data = json.data || json;
            return {
                id: String(data.id),
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : undefined,
                category: (data.category || 'coffee').toLowerCase(),
                imageUrl: `assets/images/${data.name.toLowerCase().replace(/\s+/g, '-')}.png`,
            };
        }
        catch (err) {
            console.error('💥 Fetch error:', err);
            return null;
        }
    });
}
// === Открытие модалки ===
document.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
    const card = e.target.closest('.menu-card');
    if (!card)
        return;
    const id = card.dataset.id;
    if (!id) {
        console.warn('⚠️ Missing data-id');
        return;
    }
    modal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalTitle.innerHTML = '<div class="loader"></div>';
    modalDesc.textContent = '';
    modalPrice.textContent = '';
    const product = yield fetchProductById(id);
    if (!product) {
        modalTitle.textContent = 'Something went wrong. Please, try again.';
        overlay.classList.remove('active');
        return;
    }
    basePrice = product.price;
    discountPrice = product.discountPrice || null;
    modalTitle.textContent = product.name;
    modalDesc.textContent = product.description;
    modalImage.src = product.imageUrl;
    updateTotal();
    resetOptions();
}));
[modalClose, overlay].forEach((el) => el.addEventListener('click', () => closeModal()));
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape')
        closeModal();
});
function closeModal() {
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}
// === Сброс ===
function resetOptions() {
    modal.querySelectorAll('.option').forEach((btn) => btn.classList.remove('active'));
    const defaultBtn = modal.querySelector('.modal__sizes .option[data-add="0.00"]');
    if (defaultBtn)
        defaultBtn.classList.add('active');
}
// === Пересчёт ===
function updateTotal() {
    var _a;
    const sizeAdd = parseFloat(((_a = modal.querySelector('.modal__sizes .option.active')) === null || _a === void 0 ? void 0 : _a.dataset.add) || '0');
    const additivesAdd = Array.from(modal.querySelectorAll('.modal__additives .option.active')).reduce((sum, btn) => sum + parseFloat(btn.dataset.add || '0'), 0);
    const total = basePrice + sizeAdd + additivesAdd;
    modalPrice.textContent = `$${total.toFixed(2)}`;
}
// === Добавление в корзину ===
addToCartBtn.addEventListener('click', () => {
    var _a;
    const selectedSize = modal.querySelector('.modal__sizes .option.active');
    const selectedAdditives = Array.from(modal.querySelectorAll('.modal__additives .option.active')).map((btn) => { var _a; return ((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; });
    const total = parseFloat(((_a = modalPrice.textContent) === null || _a === void 0 ? void 0 : _a.replace('$', '')) || '0');
    addToCart({
        id: crypto.randomUUID(),
        name: modalTitle.textContent || 'Unknown',
        size: (selectedSize === null || selectedSize === void 0 ? void 0 : selectedSize.textContent) || '',
        additives: selectedAdditives,
        price: total,
        discountPrice: discountPrice || undefined,
        imageUrl: modalImage.src,
    });
    updateCartCounter();
    closeModal();
});
// === Обработчики выбора размера и добавок ===
modal.addEventListener('click', (e) => {
    const target = e.target;
    // Размер
    if (target.classList.contains('option') && target.closest('.modal__sizes')) {
        modal.querySelectorAll('.modal__sizes .option').forEach((btn) => btn.classList.remove('active'));
        target.classList.add('active');
        updateTotal();
    }
    // Добавки
    if (target.classList.contains('option') && target.closest('.modal__additives')) {
        target.classList.toggle('active');
        updateTotal();
    }
});
