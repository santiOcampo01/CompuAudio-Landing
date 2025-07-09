import Login from './LoginForm.jsx'
import ProductsDashboard from './productsDashboard.jsx'
import { useState, useEffect } from 'react'

export default function Admin() {
  useEffect(() => {
    validateLogin()
  })

  async function validateLogin() {
    await fetch('https://backcompuaudio.onrender.com/auth/validate', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setUserName(data.username)
          setLogged(true)
        }
      })
  }

  const [logged, setLogged] = useState(false)
  const [userName, setUserName] = useState('Admin')

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      {logged ? (
        <ProductsDashboard userName={userName} />
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-4">Por favor, inicia sesión</h2>
          <Login setLogged={setLogged} setUserName={setUserName} />
        </div>
      )}
    </div>
  )
}
