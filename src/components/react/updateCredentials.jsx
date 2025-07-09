import { useEffect, useState } from 'react'

export default function UpdateForm({ userName, setUserName }) {
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')

  async function sendToServer(data) {
    try {
      const response = await fetch('https://backcompuaudio.onrender.com/update/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      let res = await response.json()
      if (response.ok) {
        setUserName(res.user.username)
      } else {
        throw new Error(res.message)
      }
    } catch (err) {
      setMessage(err.message)
      setError(true)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    data.username = userName
    sendToServer(data)
  }
  return (
    <form onSubmit={handleSubmit} className="container">
      <label htmlFor="newUserName">
        Nuevo nombre de Usuario:
        <input type="text" id="newUserName" name="newUserName" required />
      </label>
      <label htmlFor="password">
        Nueva contraseña:
        <input type="password" id="password" name="password" required />
      </label>
      <label htmlFor="confirmPassword">
        Conrima La Contraseña
        <input type="password" id="confirmPassword" name="confirmPassword" required />
      </label>
      <button type="submit">Guardar</button>
      {error && <p>{message}</p>}
    </form>
  )
}
