import ProducstCards from './getAllProducts.jsx'
import { useState, useEffect } from 'react'

export default function ProductsDashboard({ userName }) {
  useEffect(() => {
    fetch('http://localhost:4000/products/', {
      credentials: 'include',
    }).then(res => res.json())
      .then(data => {
        setProducts(data)
      })
  }, [])
  const [products, setProducts] = useState([])
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
          <ProducstCards products={products} />
      </main>
    </section>
  )
}
