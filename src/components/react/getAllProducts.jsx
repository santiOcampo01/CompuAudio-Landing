import { useState, useEffect } from 'react'
import EditProductComponent from './editProduct'
import AddProduct from './addProduct.jsx'
const url = import.meta.env.PUBLIC_URL

export default function ProducstCards() {
  const [products, setProducts] = useState([])
  const [editProduct, setEditProduct] = useState()
  const [render, setRender] = useState(false)
  const [reload, setReload] = useState(false)
  const [renderDelete, setRenderDelete] = useState(false)
  const [message, setMessage] = useState({ message: '', type: '' })
  const [positionComponent, setPositionComponent] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (sessionStorage.getItem('products')) {
      setProducts(JSON.parse(sessionStorage.getItem('products')))
    } else {
      getProducts()
    }
  }, [render, reload, renderDelete])
  async function getProducts() {
    try {
      await fetch(`${url}/products/`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMessage({ message: 'Productos cargados exitosamente', type: 'success' })
            setProducts(data.productos)
            sessionStorage.setItem('products', JSON.stringify(data.productos))
            setTimeout(() => {
              setMessage()
            }, 2000)
          } else {
            setMessage({ message: 'Error al cargar los productos', type: 'error' })
          }
        })
    } catch (err) {
      setMessage({ message: 'Error al conectar con el servidor', type: 'error' })
    }
  }

  async function handleDelete(slug, sha, imageName) {
    try {
      const response = await fetch(`${url}/products/${slug}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sha: sha, imageName: imageName }),
      })
      let res = await response.json()
      if (res.success) {
        setMessage({ message: 'El producto se elimino exitosamente', type: 'success' })
        setRenderDelete(!renderDelete)
      } else {
        setMessage({ message: 'Hubo un error al eliminar el producto', type: 'error' })
      }
    } catch (err) {
      setMessage({ message: 'Error al conectar con el servidor', type: 'error' })
    }
  }

  const handleAdd = () => {
    setReload(!reload)
  }

  const handleEdit = (product, positionx, positiony) => {
    setEditProduct(product)
    setPositionComponent({ x: positionx, y: positiony })
    setRender(!render)
  }
  return (
    <section className="relative productContainer px-4 py-4 flex flex-col w-full">
      {message && <p className={message.type}>{message.message}</p>}
      <style>
        {`
      .success { color: green; }
      .error { color: red; }
    `}
      </style>

      <div className="relative mb-5">
        <button
          className="w-full sm:max-w-44 py-3 px-6 font-bold bg-orange-500 text-gray-100 text-center cursor-pointer hover:bg-amber-500"
          onClick={handleAdd}
        >
          {reload ? 'Cerrar' : 'Agregar'}
        </button>
        {reload && <AddProduct setReload={setReload} />}
      </div>
      <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => {
          let key = index
          return (
            <article id={index} className="flex flex-col rounded-xl p-4 bg-gray-50 shadow" key={index}>
              <img
                className="w-full h-48 max-h-[250px] rounded-xl object-cover"
                src={`${product.image}`}
                loading="lazy"
                alt={`imagen de ${product.title}`}
              />
              <div className="pt-4 pb-2 px-2 min-h-28">
                <h3 className="font-bold text-lg line-clamp-2">{product.title}</h3>
                <span className="font-bold text-orange-600">${product.price.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-2 mt-2">
                <button
                  id={product.sha}
                  className=" bg-orange-500 w-full sm:flex-1 py-2 font-bold text-white cursor-pointer hover:bg-amber-500"
                  onClick={e => {
                    const article = e.currentTarget.closest('article')
                    const articleRect = article.getBoundingClientRect()
                    const container = e.currentTarget.closest('.productContainer')

                    // Dimensiones aproximadas del formulario
                    const formWidth = {
                      mobile: window.innerWidth * 0.9, // 90vw
                      tablet: window.innerWidth * 0.85, // 85vw
                      desktop: 450, // md:w-[450px]
                      large: 350, // lg:w-[350px]
                    }
                    // Determinar el ancho del formulario según el tamaño de la ventana
                    let currentFormWidth = formWidth.mobile
                    if (window.innerWidth >= 1024) {
                      currentFormWidth = formWidth.large
                    } else if (window.innerWidth >= 768) {
                      currentFormWidth = formWidth.desktop
                    } else if (window.innerWidth >= 640) {
                      currentFormWidth = formWidth.tablet
                    }

                    // Calcular posición X relativa al contenedor
                    const containerRect = container.getBoundingClientRect()
                    let productX = 0
                    
                    // Posición del artículo relativa al contenedor
                    const articleRelativeX = articleRect.left - containerRect.left
                    const articleCenterX = articleRelativeX + articleRect.width / 2
                    const formHalfWidth = currentFormWidth / 2
                    
                    // Ancho disponible del contenedor
                    const containerWidth = containerRect.width
                    
                    // Verificar si el formulario se sale por la derecha
                    if (articleCenterX + formHalfWidth > containerWidth - 20) {
                      // Posicionar a la izquierda del artículo
                      productX = articleRelativeX - currentFormWidth - 20
                      // Si aún se sale por la izquierda, ajustar
                      if (productX < 20) {
                        productX = 20
                      }
                    } else if (articleCenterX - formHalfWidth < 20) {
                      // Posicionar a la derecha del artículo si se sale por la izquierda
                      productX = articleRelativeX + articleRect.width + 20
                      // Si se sale por la derecha, ajustar
                      if (productX + currentFormWidth > containerWidth - 20) {
                        productX = containerWidth - currentFormWidth - 20
                      }
                    } else {
                      // Centrar el formulario respecto al artículo
                      productX = articleCenterX - formHalfWidth
                    }
                    
                    // Verificación final para asegurar que no se salga de los límites
                    if (productX < 20) {
                      productX = 20
                    } else if (productX + currentFormWidth > containerWidth - 20) {
                      productX = containerWidth - currentFormWidth - 20
                    }

                    // Calcular posición Y
                    let productY =
                      e.currentTarget.closest('article').offsetTop - e.currentTarget.parentElement.getBoundingClientRect().height - 150
                    if (e.target.getBoundingClientRect().top < window.innerHeight / 2) {
                      productY = e.currentTarget.closest('div').offsetTop + e.currentTarget.parentElement.getBoundingClientRect().height
                    }
                    
                    // Convertir a píxeles para el posicionamiento
                    productX = `${productX}px`
                    productY = `${productY}px`

                    handleEdit(
                      //le pasamos todo el product a handle
                      product,
                      //calcula la posicion de el formulario de editar respescto a la posicion del articule
                      productX,
                      // calcula la posicion de el formulario de editar respescto a la posicion del articule
                      productY,
                    )
                  }}
                >
                  {render && editProduct?.sha === product.sha ? 'Cerrar' : 'Editar'}
                </button>
                <button
                  className="bg-gray-700 w-full sm:flex-1 py-2 font-bold text-white cursor-pointer hover:bg-gray-600"
                  onClick={() => {
                    let imageName = product.image.split('/')
                    handleDelete(product.title, product.sha, imageName[2])
                  }}
                >
                  Eliminar
                </button>
              </div>
            </article>
          )
        })}
        {render && (
          <div className="absolute" style={{ left: positionComponent.x, top: positionComponent.y }}>
            <EditProductComponent productEdit={editProduct} setRender={setRender} />
          </div>
        )}
      </div>
    </section>
  )
}
