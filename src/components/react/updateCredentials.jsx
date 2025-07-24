import { useState } from 'react'
import { useForm } from 'react-hook-form'
import useNotification from '../notification'
const url = import.meta.env.PUBLIC_URL

export default function UpdateForm({ userName, setUserName }) {
  const { Notification, showNotification } = useNotification()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [message, setMessage] = useState({ message: '', type: '' })

  async function sendToServer(data) {
    try {
      await fetch(`${url}/update/`, {
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
            Notification({ message: 'La actualizacion fue exitosa', type: 'success' })
            setUserName(data.user.username)
            setTimeout(() => {
              setLogged(data.success)
            }, 3000)
            reset()
          } else {
            Notification({ message: data.message, type: 'error' })
            setTimeout(() => {
              setLogged(data.success)
            }, 3000)
          }
        })
    } catch (error) {
      Notification({ message: 'Error al conectar con el servidor', type: 'error' })
      setTimeout(() => {
        setLogged(data.success)
      }, 3000)
    }
  }

  const sendData = data => {
    data.username = userName
    sendToServer(data)
  }
  return (
    <form onSubmit={handleSubmit(sendData)} className="relative flex flex-col w-full gap-4 shadow px-5 pt-8 rounded-2xl">
      {showNotification}
      <div className="w-full relative mb-5">
        <input
          type="text"
          id="newUserName"
          {...register('newUserName', {
            required: 'El nombre de usuario es obligatorio',
            minLength: { value: 3, message: 'Mínimo 3 caracteres' },
            validate: value => value !== userName || 'El nuevo nombre de usuario debe de ser distinto al anterior',
          })}
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
        {errors.newUserName && <span>{errors.newUserName.message}</span>}
        <label
          htmlFor="newUserName"
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
      <div className="w-full relative mb-5">
        <input
          type="password"
          id="password"
          {...register('password', {
            required: 'La contraseña es obligatoria',
            minLength: { value: 5, message: 'La contraseña debe de ser de almenos 5 caracteres' },
            validate: (value, { newUserName }) => value !== newUserName || 'La contraseña no puede ser la misma que el nombre de usuario',
          })}
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
        {errors.password && <span>{errors.password.message}</span>}
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
          Nueva contraseña:
        </label>
      </div>
      <div className="w-full relative mb-5">
        <input
          type="password"
          id="confirmPassword"
          {...register('confirmPassword', {
            required: 'Confirma la contraseña',
            validate: (value, { password }) => value === password || 'Las contraseñas no coinciden',
          })}
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
        {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
        <label
          htmlFor="confirmPassword"
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
          Confirma la contraseña:
        </label>
      </div>
      <button
        type="submit"
        className="
        bg-orange-500 
        text-white p-2 
        rounded-lg 
        cursor-pointer 
        hover:bg-orange-600"
      >
        Guardar
      </button>
      {message && <p className={message.type}>{message.message}</p>}
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
