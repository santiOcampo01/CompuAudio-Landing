import { useState } from 'react'
import { useForm } from 'react-hook-form'
const url = import.meta.env.PUBLIC_URL

export default function UpdateForm({ userName, setUserName }) {
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
            setMessage({ message: 'La actualizacion fue exitosa', type: 'success' })
            setUserName(data.user.username)
            reset()
          } else {
            setMessage({ message: data.message, type: 'error' })
          }
        })
    } catch (error) {
      setMessage({ message: 'Error al conectar con el servidor', type: 'error' })
    }
  }

  const sendData = data => {
    data.username = userName
    sendToServer(data)
  }
  return (
    <form onSubmit={handleSubmit(sendData)} className="container">
      <label htmlFor="newUserName">
        Nuevo nombre de Usuario:
        <input
          type="text"
          id="newUserName"
          {...register('newUserName', {
            required: 'El nombre de usuario es obligatorio',
            minLength: { value: 3, message: 'Mínimo 3 caracteres' },
            validate: value => value !== userName || 'El nuevo nombre de usuario debe de ser distinto al anterior',
          })}
        />
        {errors.newUserName && <span>{errors.newUserName.message}</span>}
      </label>
      <label htmlFor="password">
        Nueva contraseña:
        <input
          type="password"
          id="password"
          {...register('password', {
            required: 'La contraseña es obligatoria',
            minLength: { value: 5, message: 'La contraseña debe de ser de almenos 5 caracteres' },
            validate: (value, { newUserName }) => value !== newUserName || 'La contraseña no puede ser la misma que el nombre de usuario',
          })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </label>
      <label htmlFor="confirmPassword">
        Confirma La Contraseña
        <input
          type="password"
          id="confirmPassword"
          {...register('confirmPassword', {
            required: 'Confirma la contraseña',
            validate: (value, { password }) => value === password || 'Las contraseñas no coinciden',
          })}
        />
        {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
      </label>
      <button type="submit">Guardar</button>
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
