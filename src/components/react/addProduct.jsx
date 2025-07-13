import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
const url = import.meta.env.PUBLIC_URL

export default function FormFunction({ setReload }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()
  const [file, setFile] = useState(null)
  const [base64IMG, setBase64IMG] = useState('')
  const [featured, setfeatured] = useState(false)
  const [message, setMessage] = useState({ message: '', type: '' })

  function handleFile(e) {
    const selected = e.target.files[0]
    setFile(selected)
    if (selected) {
      const reader = new FileReader()
      reader.readAsDataURL(selected)
      reader.onload = () => {
        setBase64IMG(reader.result)
      }
    }
  }

  async function addProduct(datos) {
    try {
      await fetch(`${url}/products/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMessage({ message: 'Producto agregado exitosamente', type: 'success' })
            sessionStorage.removeItem('products')
            setReload(false)
          } else {
            setMessage({ message: 'Hubo un error al agregar el producto', type: 'error' })
          }
        })
    } catch (error) {
      setMessage({ message: 'Error al conectar con el servidor', type: 'error' })
    }
  }

  const onSubmit = data => {
    data.price = parseInt(data.price.replace(/\./g, ''), 10)
    data.imageName = data.imageName[0].name
    data.imageBase64 = base64IMG
    data.tags = JSON.stringify(data.tags.split(/, |,/g))
    data.caracteristicas = JSON.stringify(data.caracteristicas.split(/, |,/g))
    data.featured = featured
    addProduct(data)
  }

  return (
    <section className="absolute inset-2/4 flex flex-col justify-center items-center w-[350px]">
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
      {/* <button className="p-6 text-2xl inline-block">x</button> */}
      <form className="bg-white opacity-100 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full relative mb-5">
          <input
            {...register('title', {
              required: { value: true, message: 'El producto debe de tener un nombre' },
              validate: value => value.trim().length > 0 || 'El nombre no puede ser solo espacios',
            })}
            type="text"
            name="title"
            id="title"
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
            htmlFor="title"
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
            Nombre del producto:
          </label>
          {errors.title && <span>{errors.title.message}</span>}
        </div>
        <div className="w-full relative mb-5">
          <input
            {...register('imageName', {
              required: {
                value: true,
                message: 'La imagen del producto es requerida',
              },
            })}
            onChange={handleFile}
            type="file"
            name="imageName"
            id="imageName"
            accept="image/png, image/jpeg, image/webp"
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
            htmlFor="imageName"
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
            Imagen del producto:
            {errors.imageName && <span>{errors.imageName.message}</span>}
          </label>
        </div>
        <div className="w-full relative mb-5">
          <input
            {...register('price', {
              required: {
                value: true,
                message: 'El producto debe de tener un precio',
              },
              min: {
                value: 1,
                message: 'El precio del producto no puede ser negativo ni cero',
              },
              validate: value => {
                const raw = parseInt(value.replace(/\./g, ''), 10)
                return !isNaN(raw) || 'El precio debe ser un número válido'
              },
            })}
            type="text"
            name="price"
            id="price"
            inputMode="numeric"
            onChange={e => {
              let raw = e.target.value.replace(/\D/g, '') // elimina todo lo que no sea número
              const formateado = new Intl.NumberFormat('es-CO').format(raw)
              setValue('price', formateado, { shouldValidate: true })
            }}
            className=" peer border h-10 w-full border-gray-400 p-2 rounded placeholder-shown:border-b-gray-400 focus:outline-none
            focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            placeholder=" "
          />
          <label
            htmlFor="price"
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
            Precio:
          </label>
          {errors.price && <span>{errors.price.message}</span>}
        </div>

        <div className="w-full relative mb-5">
          <input
            {...register('tags', {
              required: {
                value: true,
                message: 'El producto debe de tener tags',
              },
              minLength: {
                value: 1,
                message: 'El producto debe de contener al menos un tag',
              },
              validate: value => {
                if (value.trim().length === 0) {
                  return 'Los tags no pueden ser solo espacios'
                }
                if (/^(,|\s*,\s*,|,,)/.test(value)) {
                  return 'Los tags no pueden comenzar con comas ni tener comas consecutivas'
                }
                if (!/^([^\s,][^,]*)(,\s*[^\s,][^,]*)*$/.test(value)) {
                  return 'Los tags deben estar separados por comas, ejemplo: tecnologia, sonido, computadores y dispositivos, memoria'
                }
                return true
              },
            })}
            type="text"
            name="tags"
            id="tags"
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
            htmlFor="tags"
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
            Tags:
          </label>
          {errors.tags && <span>{errors.tags.message}</span>}
        </div>
        <div className="w-full relative mb-5 flex flex-col">
          <label
            htmlFor="title"
            className='flex-col'
            >
              Destacado:
          <input
            {...register('featured')}
            checked={featured}
            onChange={e => {
              setfeatured(!featured)
            }}
            type="checkbox"
            name="featured"
            id="featured"
          />
          </label>
        </div>
        <div className="w-full relative mb-5 flex flex-col">
          <input
            {...register('caracteristicas', {
              required: {
                value: true,
                message: 'El producto debe de tener caracteristicas',
              },
              minLength: {
                value: 1,
                message: 'El producto debe de contener al menos una caracteristicas',
              },
              validate: value => {
                if (value.trim().length === 0) {
                  return 'Los caracteristicas no pueden ser solo espacios'
                }
                if (/^(,|\s*,\s*,|,,)/.test(value)) {
                  return 'Los caracteristicas no pueden comenzar con comas ni tener comas consecutivas'
                }
                if (!/^([^\s,][^,]*)(,\s*[^\s,][^,]*)*$/.test(value)) {
                  return 'Los caracteristicas deben estar separados por comas, ejemplo: cable tipo c, carga rápida'
                }
                return true
              },
            })}
            type="text"
            name="caracteristicas"
            id="caracteristicas"
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
            htmlFor="title"
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
            Caracteristicas:
          </label>
          {errors.caracteristicas && <span>{errors.caracteristicas.message}</span>}
        </div>
          <div className="w-full relative mb-5 flex flex-col">
          <textarea
            {...register('content', {
              required: {
                value: true,
                message: 'La descripcion del producto es requerida',
              },
              validate: value => value.trim().length > 0 || 'La descripcion no pueden ser solo espacios',
            })}
            id="content"
            name="content"
                      className="
          peer border h-10 w-full 
        border-gray-400 p-2 rounded
        placeholder-shown:border-b-gray-400 
          focus:outline-none 
          focus:ring-2 
        focus:ring-gray-400 
          focus:border-transparent"
            placeholder=" "
          ></textarea>
          <label
            htmlFor="title"
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
            Descripcion:
          </label>
          {errors.content && <span>{errors.content.message}</span>}
        </div>
        <div>
          <button className='p-4 bg-amber-600 w-full text-gray-50'> Enviar</button>
        </div>
      </form>
    </section>
  )
}
