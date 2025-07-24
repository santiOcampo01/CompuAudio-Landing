import { useState } from 'react'

const useNotification = () => {
  const [message, setMessage] = useState({ message: '', type: '' })
  const Notification = ({ message: msg, type }) => {
    setMessage({ message: msg, type: type })
    setTimeout(() => {
      setMessage({ message: '', type: '' })
    }, 3000)
  }

  const showNotification = () => {
    if (!message.message) return null
    return (
      <div className="alerta-carrito flex items-center gap-1 py-4 px-6 bg-gray-200 fixed right-[0] top-[5%] z-100">
        {message.type === 'success' ? (
          <img className="iconCheck" src="/assets/check-mark-svgrepo-com" alt="Success" width={45} height={45} />
        ) : (
          <img className="iconError" src="/assets/xbox-x.svg" alt="Error" width={45} height={45} />
        )}
        <span>{message.message}</span>
      </div>
    )
  }
  return { showNotification, Notification }
}

export default useNotification
