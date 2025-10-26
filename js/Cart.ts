// =============================
//         TYPES
// =============================
export interface CartItem {
  id: string
  name: string
  size: string
  additives: string[]
  price: number
  discountPrice?: number
  imageUrl: string
  count?: number
}

// =============================
//         CONST & STATE
// =============================
const CART_KEY = 'coffee_cart'
let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

// =============================
//         DOM
// =============================
const cartList = document.querySelector('.cart__list') as HTMLElement | null
const cartTotal = document.querySelector('.cart__total') as HTMLElement | null
const clearBtn = document.getElementById('clearCart') as HTMLButtonElement | null
const cartIcon = document.querySelector('.cart-link') as HTMLElement | null
const authContainer = document.querySelector('.auth-buttons') as HTMLElement | null

console.log('📦 Cart script loaded')

// =============================
//         LOCAL STORAGE
// =============================
function getCart(): CartItem[] {
  const saved = localStorage.getItem(CART_KEY)
  return saved ? JSON.parse(saved) : []
}

function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

// =============================
//         ICON & COUNTER
// =============================
export function updateCartCounter(): void {
  const cart = getCart()
  const count = cart.reduce((sum, item) => sum + (item.count || 1), 0)
  if (!cartIcon) return

  if (isAuthenticated || count > 0) {
    cartIcon.style.display = 'flex'
  } else {
    cartIcon.style.display = 'none'
  }

  const counter = cartIcon.querySelector('.cart-link__counter') as HTMLElement | null
  if (counter) counter.textContent = String(count)
}

// =============================
//         CART RENDER
// =============================
function renderCart(): void {
  const cart = getCart()

  if (!cartList || !cartTotal) return

  if (cart.length === 0) {
    cartList.innerHTML = `<p class="empty">Your cart is empty.</p>`
    cartTotal.innerHTML = `<span>$0.00</span>`
    updateCartCounter()
    return
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const totalDiscounted = cart.reduce((sum, item) => sum + (item.discountPrice ?? item.price), 0)

  cartList.innerHTML = cart
    .map(
      (item) => `
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
          ${
            isAuthenticated && item.discountPrice
              ? `
                <span class="line-through">$${item.price.toFixed(2)}</span>
                <span>$${item.discountPrice.toFixed(2)}</span>`
              : `<span>$${item.price.toFixed(2)}</span>`
          }
        </div>
      </div>`
    )
    .join('')

  cartTotal.innerHTML = isAuthenticated
    ? `
      <div class="cart__price-container">
        <span class="line-through">$${total.toFixed(2)}</span>
        <span>$${totalDiscounted.toFixed(2)}</span>
      </div>`
    : `<span>$${total.toFixed(2)}</span>`

  document.querySelectorAll('.cart__item__remove').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('.cart__item') as HTMLElement | null
      if (target?.dataset.id) removeFromCart(target.dataset.id)
    })
  })

  updateCartCounter()
}

// =============================
//     ADD / REMOVE
// =============================
export function addToCart(item: CartItem): void {
  const cart = getCart()
  const existing = cart.find((i) => i.name === item.name && i.size === item.size)

  if (existing) {
    existing.count = (existing.count || 1) + 1
  } else {
    item.count = 1
    cart.push(item)
  }

  saveCart(cart)
  renderCart()
  updateCartCounter()
  console.log('🧺 Added to cart:', item)
}

function removeFromCart(id: string): void {
  const cart = getCart().filter((item) => item.id !== id)
  saveCart(cart)
  renderCart()
  updateCartCounter()
}

// =============================
//         CLEAR / INIT
// =============================
clearBtn?.addEventListener('click', () => {
  localStorage.removeItem(CART_KEY)
  renderCart()
  updateCartCounter()
})

cartIcon?.addEventListener('click', () => {
  window.location.href = 'cart.html'
})

// =============================
//     NOTIFICATION SYSTEM
// =============================
function showNotification(message: string, type: 'error' | 'success'): void {
  const existing = document.querySelector('.notification')
  if (existing) existing.remove()

  const note = document.createElement('div')
  note.className = `notification ${type}`
  note.textContent = message

  document.body.prepend(note)

  setTimeout(() => note.classList.add('visible'), 10)
  setTimeout(() => {
    note.classList.remove('visible')
    setTimeout(() => note.remove(), 400)
  }, 4000)
}

// =============================
//     AUTH / CHECKOUT SECTION
// =============================
function renderAuthSection(): void {
  if (!authContainer) return

  authContainer.innerHTML = ''

  if (!isAuthenticated) {
    authContainer.innerHTML = `
      <button class="button-outline button-icon-dark button-icon-dark--cart" id="signInBtn">Sign In</button>
      <button class="button-outline button-icon-dark button-icon-dark--cart" id="registerBtn">Registration</button>
    `
    document.getElementById('signInBtn')?.addEventListener('click', () => {
      window.location.href = 'login.html'
    })
    document.getElementById('registerBtn')?.addEventListener('click', () => {
      window.location.href = 'register.html'
    })
  } else {
    authContainer.innerHTML = `
      <div class="delivery">
        <label>
          Delivery address:
          <input type="text" class="delivery__input" placeholder="Enter address..." />
        </label>
        <button class="button-primary" id="confirmOrderBtn">Confirm Order</button>
      </div>
    `
    document
      .getElementById('confirmOrderBtn')
      ?.addEventListener('click', handleOrderConfirmation)
  }
}

// =============================
//     ORDER CONFIRMATION
// =============================
async function handleOrderConfirmation(): Promise<void> {
  const btn = document.getElementById('confirmOrderBtn') as HTMLButtonElement | null
  const input = document.querySelector('.delivery__input') as HTMLInputElement | null
  if (!btn || !input) return

  const address = input.value.trim()
  if (!address) {
    showNotification('Please enter a delivery address.', 'error')
    return
  }

  btn.disabled = true
  input.disabled = true
  btn.innerHTML = `<div class="loader small"></div> Processing...`

  try {
    const cart = getCart()

    // Пример запроса — тут можно заменить на реальный endpoint
    const response = await fetch('https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, items: cart }),
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    localStorage.removeItem(CART_KEY)
    renderCart()
    updateCartCounter()

    showNotification('Thank you for your order! Our manager will contact you shortly.', 'success')
    authContainer!.innerHTML = `<p class="success-text">✅ Order placed successfully!</p>`
  } catch (err) {
    console.error('❌ Order error:', err)
    showNotification('Something went wrong. Please, try again.', 'error')
  } finally {
    btn.disabled = false
    btn.textContent = 'Confirm Order'
    input.disabled = false
  }
}

// =============================
//         INIT
// =============================
document.addEventListener('DOMContentLoaded', () => {
  renderCart()
  updateCartCounter()
  renderAuthSection()
})
