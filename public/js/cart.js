document.addEventListener('DOMContentLoaded', () => {
  let cart = []
  if (sessionStorage.getItem('cart') === null) {
    cart = sessionStorage.setItem('cart', JSON.stringify([]))
  } else {
    cart = JSON.parse(sessionStorage.getItem('cart'))
    if (window.location.pathname.includes('/carrito')) {
      renderCart(cart)
    }
  }
})

function saveCart(cart) {
  sessionStorage.setItem('cart', JSON.stringify(cart))
}

function renderCart(cart) {
  const list = document.querySelector('#lista-carrito')
  list.innerHTML = ''

  if (cart.length === 0) {
    list.innerHTML = '<li>Tu carrito está vacío</li>'
    updateTotal(cart)
    return
  }

  cart.forEach(item => {
    createOrUpdateItem(item.slug, cart)
  })

  updateTotal(cart)
}

function createOrUpdateItem(slug, cart) {
  const list = document.querySelector('#lista-carrito')
  const producto = window.catalogo.find(p => p.slug === slug)
  const item = cart.find(i => i.slug === slug)

  if (!producto || !item) return

  const subtotal = item.quantity * producto.precio
  let li = list.querySelector(`[data-item="${slug}"]`)

  if (li) {
    li.querySelector('.cantidad-precio').innerHTML = `x${
      item.quantity
    } – <span class="precio text-orange-500 ">$${subtotal.toLocaleString()}</span>`
  } else {
    li = document.createElement('li')
    li.classList.add('item-carrito')
    li.setAttribute('data-item', slug)
    li.innerHTML = `
      <div class="contenedor-producto">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="img-producto" />
        <div class="detalles-producto">
          <h4>${producto.nombre}</h4>
          <p class="cantidad-precio">x${item.quantity} – <span class="precio text-orange-500">$${subtotal.toLocaleString()}</span></p>
          <div class="acciones">
            <button class="btn-add bg-orange-500 hover:bg-amber-500" data-slug="${slug}">+</button>
            <button class="btn-sub bg-orange-500 hover:bg-amber-500" data-slug="${slug}">−</button>
            <button class="btn-remove bg-orange-500 hover:bg-amber-500" data-slug="${slug}">Eliminar</button>
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
  let carrito = JSON.parse(sessionStorage.getItem('cart')) || []
  const item = carrito.find(i => i.slug === slug)
  if (item) {
    item.quantity++
  } else {
    carrito.push({ slug, quantity: 1 })
  }
  saveCart(carrito)
  if (!window.location.pathname.includes('/carrito')) {
    showConfirmationMessage()
  }
  if (window.location.pathname.includes('/carrito')) {
    createOrUpdateItem(slug, carrito)
  }
  updateTotal(carrito)
}

function decreaseQuantity(slug) {
  let carrito = JSON.parse(sessionStorage.getItem('cart')) || []
  const item = carrito.find(i => i.slug === slug)
  if (item) {
    item.quantity--
    if (item.quantity <= 0) {
      carrito = carrito.filter(i => i.slug !== slug)
      document.querySelector(`[data-item="${slug}"]`)?.remove()
    } else {
      createOrUpdateItem(slug, carrito)
    }
    saveCart(carrito)
    updateTotal(carrito)
  }
}

function removeFromCart(slug) {
  let carrito = JSON.parse(sessionStorage.getItem('cart')) || []
  carrito = carrito.filter(i => i.slug !== slug)
  document.querySelector(`[data-item="${slug}"]`)?.remove()
  saveCart(carrito)
  updateTotal(carrito)
}

function updateTotal(cart) {
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

function enviarPorWhatsApp(slug) {
  let carrito = JSON.parse(sessionStorage.getItem('cart')) || []
  if (!window.catalogo || carrito.length === 0) {
    alertCartEmpty()
    return
  }

  let mensaje = 'Hola, quiero hacer un pedido: \n'
  let total = 0

  carrito.forEach(item => {
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

function alertCartEmpty() {
  if (document.querySelector('.cartEmpty')) return

  const alert = document.createElement('div')
  alert.className = 'cartEmpty'
  alert.textContent = 'Tu carrito está vacío'

  document.body.appendChild(alert)

  setTimeout(() => {
    alert.remove()
  }, 2000)
}

window.sendToCart = addToCart
window.enviarPorWhatsApp = enviarPorWhatsApp
