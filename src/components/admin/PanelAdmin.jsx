import Login from './LoginForm.jsx';
import EditProducts from './editProduct.astro';

let isLoggedIn = Login;
console.log('isLoggedIn:', isLoggedIn);
export default function Admin() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      {isLoggedIn ? (
        <EditProducts />
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-4">Por favor, inicia sesión</h2>
          <Login />
        </div>
      )}
    </div>
  )
}