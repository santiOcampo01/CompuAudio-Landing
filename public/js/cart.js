
document.addEventListener('DOMContentLoaded', () => {

  if (!window.catalogo) {
    console.warn('Catálogo no disponible todavía.')
    return
  }

  updateCart()
})
let cart = []
function getCart() {
  try {
    const cartData = localStorage.getItem('cart')
    cart = cartData ? JSON.parse(cartData) : []
  } catch (e) {
    console.error('Error parsing cart data:', e)
    cart = []
  }
  return cart
}
function updateCart() {
  const list = document.querySelector('#lista-carrito')
  if (!list) return

  cart = getCart()
  list.innerHTML = ''

  if (cart.length === 0) {
    const li = document.createElement('li')
    li.textContent = 'Tu carrito está vacío'
    list.appendChild(li)
    return
  }

  cart.forEach(item => {
    const producto = window.catalogo?.find(p => p.slug === item.slug)
    if (!producto) return

    const subtotal = item.quantity * producto.precio

    const li = document.createElement('li')
    li.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}">
    <div class="info">
      <h4>${producto.nombre}</h4>
      <p>x${item.quantity} – <span class="precio">$${subtotal.toLocaleString()}</span></p>
    </div>
    <div class="acciones">
      <button class="btn-add" data-slug="${item.slug}">+</button>
      <button class="btn-sub" data-slug="${item.slug}">−</button>
      <button class="btn-remove" data-slug="${item.slug}">Eliminar</button>
    </div>
  `;
    list.appendChild(li)
  })

  document.querySelectorAll('.btn-add').forEach(btn => btn.addEventListener('click', () => addToCart(btn.dataset.slug)))
  document.querySelectorAll('.btn-sub').forEach(btn => btn.addEventListener('click', () => decreaseQuantity(btn.dataset.slug)))
  document.querySelectorAll('.btn-remove').forEach(btn => btn.addEventListener('click', () => removeFromCart(btn.dataset.slug)))

  localStorage.setItem('cart', JSON.stringify(cart))
}
  

function addToCart(slug) {
    cart = getCart()

  const existingItem = cart.find(item => item.slug === slug)
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ slug: slug, quantity: 1 })
  }

  updateCart()
}

function removeFromCart(slug) {
    cart = getCart()
    
    const itemIndex = cart.findIndex(item => item.slug === slug)
    if (itemIndex !== -1) {
        cart[itemIndex].quantity -= 1
        if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1)
        }
    } else {
        console.warn(`Item with slug "${slug}" not found in cart.`)
    }
    
    updateCart()
}

function clearCart() {
  cart = []
  localStorage.removeItem('cart')
  updateCart()
}

function decreaseQuantity(slug) {
  const cart = getCart()
  const item = cart.find(i => i.slug === slug)
  if (item) {
    item.quantity -= 1
    if (item.quantity <= 0) {
      const index = cart.indexOf(item)
      cart.splice(index, 1)
    }
  }
  localStorage.setItem('cart', JSON.stringify(cart))
  updateCart()
}

function enviarPorWhatsApp() {
  const cart = getCart()
  if (cart.length === 0) {
    alert('Tu carrito está vacío')
    return
  }

  if (!window.catalogo) {
    alert('Catálogo no cargado aún')
    return
  }

  let mensaje = 'Hola, quiero hacer un pedido:%0A'
  let total = 0

  cart.forEach(item => {
    const producto = window.catalogo.find(p => p.slug === item.slug)
    if (!producto) return

    const subtotal = item.quantity * producto.precio
    total += subtotal

    mensaje += `- ${producto.nombre} x${item.quantity} = $${subtotal.toLocaleString()}%0A`
  })

  mensaje += `%0ATotal: $${total.toLocaleString()}`

  const telefono = '573229651762' 
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`
  window.open(url, '_blank')
}
  
  
function sendToCart(slug) {
    const cart = getCart()
    const existingItem = cart.find(item => item.slug === slug)
    
    if (existingItem) {
        existingItem.quantity += 1
    } else {
        cart.push({ slug: slug, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    updateCart()
    console.log('Carrito actualizado')
}

window.sendToCart = sendToCart
window.enviarPorWhatsApp = enviarPorWhatsApp