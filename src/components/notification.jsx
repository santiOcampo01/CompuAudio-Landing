import { useState } from 'react'

export default function Notification() {
        const [message, setMessage] = useState({ message: '', type: '' })
    return (
    <div className="alerta-carrito flex items-center gap-1 py-4 px-6 bg-gray-200 fixed right-[0] top-[5%] z-100">
        <img className="iconCheck" src="/assets/check-mark-svgrepo-com.svg" alt="Check Mark" width={45} height={45} />
        <span>{message.message}</span>
    </div>
    )
}
