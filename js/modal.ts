import type { Coffee } from './types.js'
import { addToCart, updateCartCounter } from './cart.js'

const modal = document.getElementById('productModal') as HTMLElement
const modalImage = modal.querySelector('.modal__image') as HTMLImageElement
const modalTitle = modal.querySelector('.modal__title') as HTMLElement
const modalDesc = modal.querySelector('.modal__desc') as HTMLElement
const modalPrice = modal.querySelector('.modal__price') as HTMLElement
const modalClose = modal.querySelector('.modal__btn') as HTMLButtonElement
const overlay = modal.querySelector('.modal__overlay') as HTMLElement

// === Кнопка Add to Cart ===
const addToCartBtn = document.createElement('button')
addToCartBtn.className = 'button-primary modal__add'
addToCartBtn.textContent = 'Add to Cart'
modal.querySelector('.modal__info')?.appendChild(addToCartBtn)

let basePrice = 0
let discountPrice: number | null = null

// === Получение продукта по ID ===
async function fetchProductById(id: string): Promise<Coffee | null> {
  const url = `https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/${id}`
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } })
    const json = await response.json()
    const data = json.data || json
    return {
      id: String(data.id),
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : undefined,
      category: (data.category || 'coffee').toLowerCase(),
      imageUrl: `assets/images/${data.name.toLowerCase().replace(/\s+/g, '-')}.png`,
    }
  } catch (err) {
    console.error('💥 Fetch error:', err)
    return null
  }
}

// === Открытие модалки ===
document.addEventListener('click', async (e) => {
  const card = (e.target as HTMLElement).closest('.menu-card') as HTMLElement | null
  if (!card) return

  const id = card.dataset.id
  if (!id) {
    console.warn('⚠️ Missing data-id')
    return
  }

  modal.classList.add('active')
  overlay.classList.add('active')
  document.body.style.overflow = 'hidden'

  modalTitle.innerHTML = `<div class="loader"></div>`
  modalDesc.textContent = ''
  modalPrice.textContent = ''

  const product = await fetchProductById(id)
  if (!product) {
    modalTitle.textContent = 'Something went wrong. Please, try again.'
    overlay.classList.remove('active')
    return
  }

  basePrice = product.price
  discountPrice = product.discountPrice || null
  modalTitle.textContent = product.name
  modalDesc.textContent = product.description
  modalImage.src = product.imageUrl
  updateTotal()

  resetOptions()
})

// === Закрытие ===
;[modalClose, overlay].forEach((el) =>
  el.addEventListener('click', () => closeModal())
)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal()
})

function closeModal(): void {
  modal.classList.remove('active')
  overlay.classList.remove('active')
  document.body.style.overflow = ''
}

// === Сброс ===
function resetOptions(): void {
  modal.querySelectorAll('.option').forEach((btn) => btn.classList.remove('active'))
  const defaultBtn = modal.querySelector('.modal__sizes .option[data-add="0.00"]') as HTMLElement
  if (defaultBtn) defaultBtn.classList.add('active')
}

// === Пересчёт ===
function updateTotal(): void {
  const sizeAdd = parseFloat(
    (modal.querySelector('.modal__sizes .option.active') as HTMLElement)?.dataset.add || '0'
  )
  const additivesAdd = Array.from(
    modal.querySelectorAll('.modal__additives .option.active')
  ).reduce((sum, btn) => sum + parseFloat((btn as HTMLElement).dataset.add || '0'), 0)
  const total = basePrice + sizeAdd + additivesAdd
  modalPrice.textContent = `$${total.toFixed(2)}`
}

// === Добавление в корзину ===
addToCartBtn.addEventListener('click', () => {
  const selectedSize = modal.querySelector('.modal__sizes .option.active') as HTMLElement
  const selectedAdditives = Array.from(
    modal.querySelectorAll('.modal__additives .option.active')
  ).map((btn) => btn.textContent?.trim() || '')

  const total = parseFloat(modalPrice.textContent?.replace('$', '') || '0')

  addToCart({
    id: crypto.randomUUID(),
    name: modalTitle.textContent || 'Unknown',
    size: selectedSize?.textContent || '',
    additives: selectedAdditives,
    price: total,
    discountPrice: discountPrice || undefined,
    imageUrl: modalImage.src,
  })

  updateCartCounter()
  closeModal()
})
// === Обработчики выбора размера и добавок ===
modal.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

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

