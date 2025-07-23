import { useState } from 'react'
import Check from '../../public/assets/check-mark-svgrepo-com.svg'
import Error from '../../public/assets/xbox-x.svg'

const useNotification = () => {
    const [message, setMessage] = useState({message: '', type: ''})
    const showNotification = (msg, type) => {
        setMessage({ message: msg, type: type });
        setTimeout(() => {
            setMessage({ message: '', type: '' });
        }, 3000); // Clear message after 3 seconds
    }
    return { message, showNotification };
}

export default function Notification() {
        const [message, setMessage] = useState({ message: '', type: '' })
    return (
    <div className="alerta-carrito flex items-center gap-1 py-4 px-6 bg-gray-200 fixed right-[0] top-[5%] z-100">
        {message.type === 'success' ? (
            <img className="iconCheck" src={Check} alt="Check Mark" width={45} height={45} />
        ) : (
            <img className="iconError" src={Error} alt="Error" width={45} height={45} />
        )}
        <span>{message.message}</span>
    </div>
    )
}
