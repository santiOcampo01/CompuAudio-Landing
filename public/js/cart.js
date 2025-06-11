document.addEventListener('DOMContentLoaded', () => {
  if (!window.catalogo) {
    console.warn('Catálogo no disponible todavía.')
    return
  }

  cart = getCart()
  renderCart()
  updateTotal()
})

let cart = []

function getCart() {
  try {
    const data = sessionStorage.getItem('cart')
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('Error leyendo el carrito:', e)
    return []
  }
}

function saveCart() {
  sessionStorage.setItem('cart', JSON.stringify(cart))
}

function renderCart() {
  const list = document.querySelector('#lista-carrito')
  list.innerHTML = ''

  if (cart.length === 0) {
    list.innerHTML = '<li>Tu carrito está vacío</li>'
    updateTotal()
    return
  }

  cart.forEach(item => {
    createOrUpdateItem(item.slug)
  })

  updateTotal()
}

function createOrUpdateItem(slug) {
  const list = document.querySelector('#lista-carrito')
  const producto = window.catalogo.find(p => p.slug === slug)
  const item = cart.find(i => i.slug === slug)

  if (!producto || !item) return

  const subtotal = item.quantity * producto.precio
  let li = list.querySelector(`[data-item="${slug}"]`)

  if (li) {
    li.querySelector('.cantidad-precio').innerHTML = `x${item.quantity} – <span class="precio">$${subtotal.toLocaleString()}</span>`
  } else {
    li = document.createElement('li')
    li.classList.add('item-carrito')
    li.setAttribute('data-item', slug)
    li.innerHTML = `
      <div class="contenedor-producto">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="img-producto" />
        <div class="detalles-producto">
          <h4>${producto.nombre}</h4>
          <p class="cantidad-precio">x${item.quantity} – <span class="precio">$${subtotal.toLocaleString()}</span></p>
          <div class="acciones">
            <button class="btn-add" data-slug="${slug}">+</button>
            <button class="btn-sub" data-slug="${slug}">−</button>
            <button class="btn-remove" data-slug="${slug}">Eliminar</button>
          </div>
        </div>
      </div>
    `
    list.appendChild(li)

    li.querySelector('.btn-add').addEventListener('click', () => addToCart(slug))
    li.querySelector('.btn-sub').addEventListener('click', () => decreaseQuantity(slug))
    li.querySelector('.btn-remove').addEventListener('click', () => removeFromCart(slug))
  }
}

function addToCart(slug) {
  const item = cart.find(i => i.slug === slug)
  if (item) {
    item.quantity++
  } else {
    cart.push({ slug, quantity: 1 })
  }
  showConfirmationMessage()
  saveCart()
  createOrUpdateItem(slug)
  updateTotal()
}

function decreaseQuantity(slug) {
  const item = cart.find(i => i.slug === slug)
  if (item) {
    item.quantity--
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.slug !== slug)
      document.querySelector(`[data-item="${slug}"]`)?.remove()
    } else {
      createOrUpdateItem(slug)
    }
    saveCart()
    updateTotal()
  }
}

function removeFromCart(slug) {
  cart = cart.filter(i => i.slug !== slug)
  document.querySelector(`[data-item="${slug}"]`)?.remove()
  saveCart()
  updateTotal()
}

function clearCart() {
  cart = []
  sessionStorage.removeItem('cart')
  renderCart()
}

function updateTotal() {
  const totalContainer = document.getElementById('valor-total')
  const total = cart.reduce((acc, item) => {
    const producto = window.catalogo.find(p => p.slug === item.slug)
    return producto ? acc + item.quantity * producto.precio : acc
  }, 0)

  if (totalContainer) {
    totalContainer.textContent = `$${total.toLocaleString()}`
  }
}

function showConfirmationMessage() {
  const notificacion = document.querySelector('.alerta-carrito')

  setTimeout(() => {
    notificacion.classList.add('visible')
  }, 10)

  setTimeout(() => {
    notificacion.classList.remove('visible')
  }, 2500)
}

function enviarPorWhatsApp() {
  if (!window.catalogo || cart.length === 0) {
    alert('Tu carrito está vacío o el catálogo no está cargado.')
    return
  }

  let mensaje = 'Hola, quiero hacer un pedido: \n'
  let total = 0

  cart.forEach(item => {
    const producto = window.catalogo.find(p => p.slug === item.slug)
    if (!producto) return
    const subtotal = item.quantity * producto.precio
    total += subtotal
    mensaje += `- ${producto.nombre} x ${item.quantity} = $${subtotal.toLocaleString()} \n`
  })

  mensaje += `\n Total: $${total.toLocaleString()}`
  const telefono = '573229651762'
  window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank')
}

window.sendToCart = addToCart
window.enviarPorWhatsApp = enviarPorWhatsApp
