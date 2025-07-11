import { useState } from 'react'
import { useForm } from 'react-hook-form'
const url = import.meta.env.PUBLIC_URL

export default function LoginForm({ setLogged, setUserName }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [message, setMessage] = useState({ message: '', type: '' })

  const sendToServer = async data => {
    try {
      return await fetch(`${url}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMessage({ message: 'Inicio de sesion exitoso', type: 'success' })
            setTimeout(() => {
              setLogged(data.success)
            }, 3000)
            return data.userLogin.username
          } else {
            setMessage({ message: 'Usuario o contraseña incorrectos', type: 'error' })
            setLogged(data.success)
          }
        })
    } catch (error) {
      setMessage({ message: 'Error al conectar con el servidor', type: 'error' })
      setLogged(false)
    }
  }

  const manageData = async data => {
    const userName = await sendToServer(data)
    setUserName(userName)
  }

  return (
    <form onSubmit={handleSubmit(manageData)} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Iniciar sesión</h1>
      <label htmlFor="username" className="flex flex-col">
        Usuario:
        <input
          {...register('username', {
            required: 'Proporcione el modo de usuario',
          })}
          type="text"
          name="username"
          className="border p-2 rounded"
        />
        {errors.username && <span>{errors.username.message}</span>}
      </label>
      <label htmlFor="password" className="flex flex-col">
        Contraseña:
        <input
          {...register('password', {
            required: 'La contraseña es obligatoria',
          })}
          type="password"
          name="password"
          className="border p-2 rounded"
        />
        {errors.password && <span>{errors.password.message}</span>}
      </label>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Iniciar sesión
      </button>
      {message && <p className={message.type}>{message.message}</p>}
      <style>
        {`
          .success {
          color: green;
          }
          .error {
          color: red;}
          `}
      </style>
    </form>
  )
}
