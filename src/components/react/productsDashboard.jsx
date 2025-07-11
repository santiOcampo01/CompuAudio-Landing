import ProducstCards from './getAllProducts.jsx'
import UpdateForm from './updateCredentials.jsx'
import { useState, useEffect } from 'react'
const url = import.meta.env.PUBLIC_URL

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

  const logout = () => {
    fetch(`${url}/logout/`, {
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
        </div>
        {render == 'products' ? <ProducstCards /> : <UpdateForm userName={username} setUserName={setUserName} />}
      </main>
    </section>
  )
}
