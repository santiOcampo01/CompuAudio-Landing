import { useState } from 'react'
const url = import.meta.env.PUBLIC_URL

export default function LoginForm({ setLogged, setUserName }) {
  const [error, setError] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async e => {
    setError(false)
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    const userName = await sendToServer(data)
    setUserName(userName.username)
  }

  const sendToServer = async data => {
    try {
      const response = await fetch(`${url}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      let res = await response.json()
      if (!res.success) {
        setError(true)
        throw new Error('Usuario o contraseña incorrectos')
      } else {
        setLogged(res.success)
        setError(false)
        return res.userLogin
      }
    } catch (error) {
      setError(true)
      setErrorMessage('Usuario o contraseña incorrectos')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Iniciar sesión</h1>
      <label className="flex flex-col">
        Usuario:
        <input type="text" name="username" className="border p-2 rounded" required />
      </label>
      <label className="flex flex-col">
        Contraseña:
        <input type="password" name="password" className="border p-2 rounded" required />
      </label>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Iniciar sesión
      </button>
      {error && <p>{errorMessage}</p>}
    </form>
  )
}
