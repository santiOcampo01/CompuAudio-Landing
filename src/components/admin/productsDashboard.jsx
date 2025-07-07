import { useState, useEffect } from "react"

export default function ProductsDashboard({userName}) {
    useEffect(() => {
      fetch('http://localhost:4000/products/', {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          setProducts(data)
        })
    }, [])
    const [products, setProducts] = useState([])
    console.log(products)
  return (
    <section className="container">
      <aside className="navContainer">
        <nav>
          <ul>
            <li>
              <button>Productos</button>
            </li>
            <li>
              <button>Usuario</button>
            </li>
            <li>
              <button>Cerrar Sesion</button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="mainContainer">
        <div className="headerContainer">
          <header>
            <h1>Panel de admistracion</h1>
            <p>
              Hola, <span>{userName}</span>
            </p>
          </header>
        </div>
        <article className="productsContainer">
          {
            products.map((product) => {
              return(
            <div key={products.indexOf(product)}>
              <img src={`../../../public/${product.image}`} alt={`Imagen ${product.title}`} width={"10px"} height={'10px'}  />
              <p>{product.title}</p>
            </div>
              )
            })
          }
        </article>
      </main>
    </section>
  )
}