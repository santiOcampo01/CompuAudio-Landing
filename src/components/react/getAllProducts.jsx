import { useState, useEffect } from "react"
export default function ProducstCards() {
    const [products, setProducts] = useState([])
  useEffect(() => {
    fetch('http://localhost:4000/products/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data)
      })
  }, [])

  async function handleDelete(slug, sha, imageName) {
    try {
      await fetch(`http://localhost:4000/products/${slug}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({sha: sha, imageName: imageName}),
      })
        .then(res => res.json())
        .them(data => {
          console.log(data)
        })
    } catch (err) {
      alert('Mega error')
    }
  }
  return (
    <section className="productContainer container px-4 flex ">
      {products.map(product => {
        let key = products.indexOf(product)
        return (
          <article className="productCard gap-5 p-5" key={key + 1}>
            <div className="productInfo">
              <div className="h-[300px]">
                <img className="h-[100%]" src={`${product.image}`} width={'100%'} height={'100%'} />
              </div>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <span>{product.price}</span>
            </div>
            <div className="productButton justify-center gap-2">
              <button className="w-[50%] p-3">Editar</button>
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
    </section>
  )
}

