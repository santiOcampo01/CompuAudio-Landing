import Login from './LoginForm.jsx'
import ProductsDashboard from './productsDashboard.jsx'
import { useState, useEffect } from 'react'
const url = import.meta.env.PUBLIC_URL

export default function Admin() {
  useEffect(() => {
    validateLogin()
  })

  async function validateLogin() {
    await fetch(`${url}/auth/validate`, {
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
    <>
      {logged ? (
        <ProductsDashboard userName={userName} />
      ) : (
        <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto mt-10 shadow-xl p-6 sm:p-10 bg-gray-100 rounded-xl">
          <img className="my-2 w-16 h-auto rounded-xl" src="/favicon/logoCompuAudio-Copy.png" alt="Logo Admin" />
          <h2 className="text-2xl font-bold cursor-default">Admin</h2>
          <Login setLogged={setLogged} setUserName={setUserName} />
        </div>
      )}
    </>
  )
}
