import { useState } from 'react';
import PanelAdmin from './PanelAdmin.jsx';

export default function LoginForm() {
const [error, setError] = useState(null);
const [errorMessage, setErrorMessage] = useState('');
const [userName, setUserName] = useState('Admin');

const handleSubmit = async e => {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(e.target))
  console.log('Form data:', data)
  const userName = await sendToServer(data)
  setUserName(userName.username)
}

const sendToServer = async (data) => {
  console.log('Form submitted:', userName)
  try {
    const response = await fetch('http://localhost:4000/login/', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      }
    )
    let res = await response.json()
    if (!res.success) {
      console.log('Network response was not ok:', response)
      setError(true)
      throw new Error(res.message)
    } else {
      if (res.success) {
        console.log('Login successful:', res)
        return userName
      } else {
        setErrorMessage('Usuario o contraseña incorrectos')
        setError(true)
      }
    }
  }catch (error) {
    setError(true);
    setErrorMessage(error.message);
  }
}

if(error) {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold text-red-500'>Error al iniciar sesión</h1>
      <p className='text-red-500'>{errorMessage}</p>
      <button onClick={() => setError(false)} className='bg-blue-500 text-white p-2 rounded mt-4'>
        Volver a intentar
      </button>
    </div>
  )}else {
    return (
  <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
    <h1 className='text-2xl font-bold'>Iniciar sesión</h1>
    <label className='flex flex-col'>
      Usuario:
      <input
        type='text'
        name='username'
        className='border p-2 rounded'
        required
      />
    </label>
    <label className='flex flex-col'>
      Contraseña:
      <input
        type='password'
        name='password'
        className='border p-2 rounded'
        required
      />
    </label>
    <button type='submit' className='bg-blue-500 text-white p-2 rounded'>
      Iniciar sesión
    </button>
  </form>
  )}
}