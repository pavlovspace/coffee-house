var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// =============================
//         CONST & STATE
// =============================
const CART_KEY = 'coffee_cart';
let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
// =============================
//         DOM
// =============================
const cartList = document.querySelector('.cart__list');
const cartTotal = document.querySelector('.cart__total');
const clearBtn = document.getElementById('clearCart');
const cartIcon = document.querySelector('.cart-link');
const authContainer = document.querySelector('.auth-buttons');
console.log('📦 Cart script loaded');
// =============================
//         LOCAL STORAGE
// =============================
function getCart() {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
}
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
// =============================
//         ICON & COUNTER
// =============================
export function updateCartCounter() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + (item.count || 1), 0);
    if (!cartIcon)
        return;
    if (isAuthenticated || count > 0) {
        cartIcon.style.display = 'flex';
    }
    else {
        cartIcon.style.display = 'none';
    }
    const counter = cartIcon.querySelector('.cart-link__counter');
    if (counter)
        counter.textContent = String(count);
}
// =============================
//         CART RENDER
// =============================
function renderCart() {
    const cart = getCart();
    if (!cartList || !cartTotal)
        return;
    if (cart.length === 0) {
        cartList.innerHTML = '<p class="empty">Your cart is empty.</p>';
        cartTotal.innerHTML = '<span>$0.00</span>';
        updateCartCounter();
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const totalDiscounted = cart.reduce((sum, item) => { var _a; return sum + ((_a = item.discountPrice) !== null && _a !== void 0 ? _a : item.price); }, 0);
    cartList.innerHTML = cart
        .map((item) => `
      <div class="cart__item" data-id="${item.id}">
        <div class="cart__item__info">
          <button class="cart__item__remove" title="Remove item">
            <img src="assets/icons/trash.svg" alt="Remove item" class="cart__item__remove-icon" />
          </button>
          <img src="${item.imageUrl}" alt="${item.name}" class="cart__item__image" />
          <div class="cart__item__description">
            <h3>${item.name}</h3>
            <p>${item.size}${item.additives.length ? ', ' + item.additives.join(', ') : ''}</p>
          </div>
        </div>

        <div class="cart__item__price-container">
          ${isAuthenticated && item.discountPrice
        ? `
                <span class="line-through">$${item.price.toFixed(2)}</span>
                <span>$${item.discountPrice.toFixed(2)}</span>`
        : `<span>$${item.price.toFixed(2)}</span>`}
        </div>
      </div>`)
        .join('');
    cartTotal.innerHTML = isAuthenticated
        ? `
      <div class="cart__price-container">
        <span class="line-through">$${total.toFixed(2)}</span>
        <span>$${totalDiscounted.toFixed(2)}</span>
      </div>`
        : `<span>$${total.toFixed(2)}</span>`;
    document.querySelectorAll('.cart__item__remove').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const target = e.target.closest('.cart__item');
            if (target === null || target === void 0 ? void 0 : target.dataset.id)
                removeFromCart(target.dataset.id);
        });
    });
    updateCartCounter();
}
// =============================
//     ADD / REMOVE
// =============================
export function addToCart(item) {
    const cart = getCart();
    // Каждый товар добавляется как новая запись
    item.id = crypto.randomUUID();
    item.count = 1;
    cart.push(item);
    saveCart(cart);
    renderCart();
    updateCartCounter();
    console.log('🧺 Added to cart:', item);
}
function removeFromCart(id) {
    const cart = getCart();
    const index = cart.findIndex((item) => item.id === id);
    if (index !== -1) {
        const product = cart[index];
        // если count > 1 — уменьшаем количество
        if ((product.count || 1) > 1) {
            product.count--;
        }
        else {
            // иначе удаляем полностью
            cart.splice(index, 1);
        }
        saveCart(cart);
        renderCart();
        updateCartCounter();
    }
}
// =============================
//         CLEAR / INIT
// =============================
clearBtn === null || clearBtn === void 0 ? void 0 : clearBtn.addEventListener('click', () => {
    localStorage.removeItem(CART_KEY);
    renderCart();
    updateCartCounter();
});
cartIcon === null || cartIcon === void 0 ? void 0 : cartIcon.addEventListener('click', () => {
    window.location.href = 'cart.html';
});
// =============================
//     NOTIFICATION SYSTEM
// =============================
function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing)
        existing.remove();
    const note = document.createElement('div');
    note.className = `notification ${type}`;
    note.textContent = message;
    document.body.prepend(note);
    setTimeout(() => note.classList.add('visible'), 10);
    setTimeout(() => {
        note.classList.remove('visible');
        setTimeout(() => note.remove(), 400);
    }, 4000);
}
// =============================
//     AUTH / CHECKOUT SECTION
// =============================
function renderAuthSection() {
    var _a, _b, _c;
    if (!authContainer)
        return;
    authContainer.innerHTML = '';
    if (!isAuthenticated) {
        authContainer.innerHTML = `
      <button class="button-outline button-icon-dark button-icon-dark--cart" id="signInBtn">Sign In</button>
      <button class="button-outline button-icon-dark button-icon-dark--cart" id="registerBtn">Registration</button>
    `;
        (_a = document.getElementById('signInBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            window.location.href = 'signin.html';
        });
        (_b = document.getElementById('registerBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
            window.location.href = 'register.html';
        });
    }
    else {
        authContainer.innerHTML = `
      <div class="delivery">
        <label>
          Delivery address:
          <input type="text" class="delivery__input" placeholder="Enter address..." />
        </label>
        <button class="button-primary" id="confirmOrderBtn">Confirm Order</button>
      </div>
    `;
        (_c = document.getElementById('confirmOrderBtn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', handleOrderConfirmation);
    }
}
// =============================
//     ORDER CONFIRMATION
// =============================
function handleOrderConfirmation() {
    return __awaiter(this, void 0, void 0, function* () {
        const btn = document.getElementById('confirmOrderBtn');
        const input = document.querySelector('.delivery__input');
        if (!btn || !input)
            return;
        const address = input.value.trim();
        if (!address) {
            showNotification('Please enter a delivery address.', 'error');
            return;
        }
        btn.disabled = true;
        input.disabled = true;
        btn.innerHTML = '<div class="loader small"></div> Processing...';
        try {
            const cart = getCart();
            const response = yield fetch('https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, items: cart }),
            });
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            localStorage.removeItem(CART_KEY);
            renderCart();
            updateCartCounter();
            showNotification('Thank you for your order! Our manager will contact you shortly.', 'success');
            authContainer.innerHTML = '<p class="success-text">✅ Order placed successfully!</p>';
        }
        catch (err) {
            console.error('❌ Order error:', err);
            showNotification('Something went wrong. Please, try again.', 'error');
        }
        finally {
            btn.disabled = false;
            btn.textContent = 'Confirm Order';
            input.disabled = false;
        }
    });
}
// =============================
//         INIT
// =============================
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartCounter();
    renderAuthSection();
});
