import react from 'react';
import { useState } from 'react';


export default function LoginForm() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  return (
    <form className="flex flex-col gap-4 p-4 bg-white rounded shadow-md" onSubmit={e => handleSubmit(e)}>
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <label className="flex flex-col">
        Username:
        <input type="text" value={userName} onChange={e => setUserName(e.target.value)} className="p-2 border rounded" required />
      </label>
      <label className="flex flex-col">
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="p-2 border rounded" required />
      </label>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Login
      </button>
      <p className="text-red-500 mt-2">Invalid username or password</p>
    </form>
  )

  async function handleSubmit(e) {
    e.preventDefault();
    setError(false);
    try {
      const response = await fetch('http://localhost:4000/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password }),
      });
      if (response.ok) {
        console.log('Login successful');
        const data = await response.json();
        console.log('Token:', data.token);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }

    console.log(error)
  }

  // Replace onSubmit in the form with handleSubmit
  // Replace the error message paragraph with: {error && <p className='text-red-500 mt-2'>Invalid username or password</p>}
}
