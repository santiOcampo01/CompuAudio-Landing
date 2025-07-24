import { useState } from 'react'
import { useForm } from 'react-hook-form'
import useNotification from '../notification'
const url = import.meta.env.PUBLIC_URL

export default function LoginForm({ setLogged, setUserName }) {
  const { Notification, showNotification } = useNotification()
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
            Notification({ message: 'Inicio de sesion exitoso', type: 'success' })
            setTimeout(() => {
              setLogged(data.success)
            }, 3000)
            return data.userLogin.username
          } else {
            Notification({ message: 'Usuario o contraseña incorrectos', type: 'error' })
            setLogged(data.success)
          }
        })
    } catch (error) {
      Notification({ message: 'Error al conectar con el servidor', type: 'error' })
      setLogged(false)
    }
  }

  const manageData = async data => {
    const userName = await sendToServer(data)
    setUserName(userName)
  }

  return (
    <form onSubmit={handleSubmit(manageData)} className="relative flex flex-col w-full gap-4 shadow px-5 pt-8 rounded-2xl">
      {showNotification()}
      <div className="w-full relative mb-5">
        <input
          {...register('username', {
            required: 'Proporcione el nombre de usuario',
            validate: value => value.trim().length > 0 || 'El nombre de usuario no debe de ser solo espacios',
          })}
          type="text"
          id="username"
          name="username"
          className="
          peer border h-10 w-full 
        border-gray-400 p-2 rounded
        placeholder-shown:border-b-gray-400 
          focus:outline-none 
          focus:ring-2 
        focus:ring-gray-400 
          focus:border-transparent"
          placeholder=" "
        />
        <label
          htmlFor="username"
          className="absolute -top-6 left-1 
          text-base font-bold text-gray-500 
          transition-all 
          peer-placeholder-shown:text-base 
          peer-placeholder-shown:top-2 
          peer-placeholder-shown:font-normal 
        peer-placeholder-shown:text-gray-400
          peer-focus:-top-6 
          peer-focus:text-base  
          peer-focus:font-bold 
          peer-focus:text-gray-800"
        >
          Nombre de usuario:
        </label>
      </div>
      {errors.username && <span className="text-red-800 font-bold">{errors.username.message}</span>}
      <div className="w-full relative">
        <input
          {...register('password', {
            required: 'Proporcione la contraseña',
          })}
          type="password"
          name="password"
          id="password"
          className="
          peer border h-10 w-full 
        border-gray-400 p-2 rounded
        placeholder-shown:border-b-gray-400 
          focus:outline-none 
          focus:ring-2 
        focus:ring-gray-400 
          focus:border-transparent"
          placeholder=" "
        />
        <label
          htmlFor="password"
          className="absolute -top-6 left-1 
          text-base font-bold text-gray-500 
          transition-all 
          peer-placeholder-shown:text-base 
          peer-placeholder-shown:top-2 
          peer-placeholder-shown:font-normal 
        peer-placeholder-shown:text-gray-400
          peer-focus:-top-6 
          peer-focus:text-base  
          peer-focus:font-bold 
          peer-focus:text-gray-800"
        >
          Contraseña:
        </label>
      </div>
      {errors.password && <span className="text-red-800 font-bold">{errors.password.message}</span>}
      <button
        type="submit"
        className="
        bg-orange-500 
        text-white p-2 
        rounded-lg 
        cursor-pointer 
        hover:bg-amber-500"
      >
        Iniciar sesión
      </button>
      {message && <p className={`font-bold ${message.type}`}>{message.message}</p>}
      <style>
        {`
          .success {
          color: green;
          padding-top: 0.5rem;
          background-color: white;
          position: absolute;
          left: 25%;
          top: 100%
          }

          .success:before {
          content: '👍';
          }
          .error {
          color: red;
          padding-top: 0.5rem;
          background-color: white;
          position: absolute;
          left: 25%;
          top: 100%}

          .error:before {
          content: '✖️';
          }
          `}
      </style>
    </form>
  )
}
