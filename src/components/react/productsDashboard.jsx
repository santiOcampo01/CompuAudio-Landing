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
    <section className="w-full flex flex-col md:flex-row bg-gray-100 mt-5 min-h-screen">
      <aside className="bg-gray-100 w-full md:w-64 p-4 font-bold  border-gray-300">
        <nav className="w-full">
          <ul className="flex  flex-col  justify-around md:gap-2 gap-1">
            <li>
              <button
                className="w-full p-3 bg-orange-500 rounded-xl text-gray-100 text-center cursor-pointer hover:bg-amber-500"
                onClick={handleProducts}
              >
                Productos
              </button>
            </li>
            <li>
              <button
                className="w-full p-3 bg-orange-500 rounded-xl text-gray-100 text-center cursor-pointer hover:bg-amber-500"
                onClick={handleCredentials}
              >
                Usuario
              </button>
            </li>
            <li>
              <button
                className="w-full p-3 bg-orange-500 rounded-xl text-gray-100 text-center cursor-pointer hover:bg-amber-500"
                onClick={logout}
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 w-full p-4">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 pb-4">
          <h1 className="text-xl font-bold">{render == 'products' ? 'Panel de administración' : 'Actualizar credenciales'}</h1>
          <p className="text-xl">
            Bienvenido, <span className="font-bold  text-amber-700">{username}</span>
          </p>
        </header>
        {render == 'products' ? <ProducstCards /> : <UpdateForm userName={username} setUserName={setUserName} />}
      </main>
    </section>
  )
}
