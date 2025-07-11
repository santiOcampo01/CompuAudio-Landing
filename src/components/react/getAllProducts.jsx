import { useState, useEffect } from 'react'
import EditProductComponent from './editProduct'
import AddProduct from './addProduct.jsx'
const url = import.meta.env.PUBLIC_URL

export default function ProducstCards() {
  const [products, setProducts] = useState([])
  const [editProduct, setEditProduct] = useState()
  const [render, setRender] = useState(false)
  const [buttonClicked, setButtonClicked] = useState('')
  const [reload, setReload] = useState(false)

  if (products.length < 1) {
    geProducts()
  }
  async function geProducts() {
    try {
      await fetch(`${url}/products/`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          setProducts(data)
        })
    } catch (err) {
      alert(err.message)
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
      if (response.ok) {
        console.log(res)
        alert('Todo fue un exito')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  const handleAdd = () => {
    setReload(!reload)
  }


  return (
    <section className="productContainer container px-4 flex flex-col">
      <div>
        <button onClick={handleAdd}>Add product</button>
      </div>
      <div className="container flex">
        {products.map(product => {
          let key = products.indexOf(product)
          return (
            <article className="productCard gap-5 p-5" key={key + 1}>
              <div className="productInfo">
                <div className="h-[300px]">
                  <img
                    className="h-[100%]"
                    src={`${product.image}`}
                    loading="lazy"
                    width="100%"
                    height="100%"
                    alt={`imagen de ${product.title}`}
                  />
                </div>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <span>{product.price}</span>
              </div>
              <div className="productButton justify-center gap-2">
                <button
                  id={product.sha}
                  className="w-[50%] p-3"
                  onClick={e => {
                    if (e.target.id == buttonClicked) {
                      setRender(!render)
                    } else {
                      setEditProduct(product)
                      setRender(true)
                    }
                    setButtonClicked(e.target.id)
                  }}
                >
                  Editar
                </button>
                <button
                  className="w-[50%] p-3"
                  onClick={e => {
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
      </div>
      {reload && <AddProduct />}
      {render && <EditProductComponent productEdit={editProduct} />}
    </section>
  )
}
