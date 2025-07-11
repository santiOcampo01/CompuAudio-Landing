import ProducstCards from './getAllProducts.jsx'
import UpdateForm from './updateCredentials.jsx'
import { useState, useEffect } from 'react'
const url = import.meta.env.PUBLIC_URL

export default function ProductsDashboard({ userName }) {
  const [render, setRender] = useState('products')
  const [username, setUserName] = useState(userName)
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
    <section className="w-full flex bg-amber-100">
      <aside className="flex flex-col bg-amber-600 flex-1 items-center">
        <nav className='pt-10'>
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
      <main className="mainContainer flex-6 ">
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
