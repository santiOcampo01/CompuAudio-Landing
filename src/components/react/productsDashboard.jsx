import ProducstCards from './getAllProducts.jsx'
import UpdateForm from './updateCredentials.jsx'
import AddProduct from './addProduct.jsx'
import { useState, useEffect } from 'react'

export default function ProductsDashboard({ userName }) {
  const [render, setRender] = useState('products')
  const [username, setUserName] = useState(userName)
  const [reload, setReload] = useState(false)


  const handleProducts = () => {
    setRender('products')
  }
  const handleCredentials = () => {
    setRender('credentials')
  }
  const handleAdd = () => {
    setReload(!reload)
  }

  const logout = () => {
    fetch('http://localhost:4000/logout/', {
      credentials: 'include',
    })
    window.location.reload()
  }
  return (
    <section className="container">
      <aside className="navContainer">
        <nav>
          <ul>
            <li>
              <button onClick={handleProducts}>Productos</button>
            </li>
            <li>
              <button onClick={handleCredentials}>Usuario</button>
            </li>
            <li>
              <button onClick={logout}>Cerrar Sesion</button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="mainContainer">
        <div className="headerContainer">
          <header>
            <h1>Panel de admistracion</h1>
            <p>
              Hola, <span>{username}</span>
            </p>
          </header>
          <button onClick={handleAdd}>Add product</button>
        </div>
        {reload && <AddProduct />}
        {render == 'products' ? (
          <ProducstCards />
        ) : (
          <UpdateForm userName={username} setUserName={setUserName} />
        )}
      </main>
    </section>
  )
}
