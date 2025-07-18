import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
const url = import.meta.env.PUBLIC_URL

export default function EditProductComponent({ productEdit, setRender }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      title: productEdit.title,
      price: productEdit.price.toLocaleString('es-CO'),
      tags: productEdit.tags.toString(),
      caracteristicas: productEdit.caracteristicas.toString(),
      content: productEdit.content,
    },
  })

  const [featured, setfeatured] = useState(productEdit.featured)
  const [base64IMG, setBase64IMG] = useState('')
  const [message, setMessage] = useState({ message: '', type: '' })

  async function updateProduct(data) {
    const slug = data.title
    try {
      await fetch(`${url}/products/${slug}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMessage({ message: 'Producto editado exitosamente', type: 'success' })
            sessionStorage.removeItem('products')
            setRender(false)
            setTimeout(() => {
              setMessage({ message: '', type: '' })
            }, 3000)
          } else {
            setMessage({ message: 'Hubo un error al editar el producto', type: 'error' })
            setTimeout(() => {
              setMessage({ message: '', type: '' })
            }, 3000)
          }
        })
    } catch (err) {
      setMessage({ message: 'Error al conectar con el servidor', type: 'error' })
      setTimeout(() => {
        setMessage({ message: '', type: '' })
      }, 3000)
    }
  }

  function handleFile(e) {
    const selected = e.target.files[0]
    if (selected) {
      const reader = new FileReader()
      reader.readAsDataURL(selected)
      reader.onload = () => {
        setBase64IMG(reader.result)
      }
    }
  }

  const onSubmit = data => {
    data.price = parseInt(data.price.replace(/\./g, ''), 10)
    if (data.imageName.length == 0) {
      delete data.imageName
    } else {
      data.imageName = data.imageName[0].name
      data.imageBase64 = base64IMG
    }
    data.tags = JSON.stringify(data.tags.split(/, |,/g))
    data.caracteristicas = JSON.stringify(data.caracteristicas.split(/, |,/g))
    data.featured = featured
    data.sha = productEdit.sha
    updateProduct(data)
  }

  return (
    <div className="absolute  z-50  w-[95vw] sm:w-[90vw] md:w-[500px] lg:w-[400px] bg-white rounded-xl shadow-2xl">
      {message && <p className={message.type}>{message.message}</p>}
      <style>
        {`
          .success {
          color: green;
          padding-top: 0.5rem;
          background-color: white;
          position: absolute;
          left: 25%;
          top: 50%
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
          top: 50%}

          .error:before {
          content: '✖️';
          }
          `}
      </style>
      <h2 className="font-bold font-lg self-start px-5 pt-5">Editar {productEdit.title}</h2>
      <form className="flex flex-col gap-5 p-5 overflow-y-auto max-h-[70vh] sm:max-h-[60vh]" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full relative">
          <label
            htmlFor="title"
            className="
            text-base font-bold text-gray-900 "
          >
            Nombre del producto:
          </label>
          <input
            {...register('title', {
              required: { value: true, message: 'El producto debe de tener un nombre' },
              validate: value => value.trim().length > 0 || 'El nombre no puede ser solo espacios',
            })}
            type="text"
            name="title"
            id="title"
            className="border h-10 w-full 
        border-gray-400 p-2 rounded
        placeholder-shown:border-b-gray-400 
          focus:outline-none 
          focus:ring-2 
        focus:ring-gray-400"
            placeholder="TV Box"
          />
          {errors.title && <span className="text-red-800 font-bold">{errors.title.message}</span>}
        </div>
        {/* input imagen */}
        <div className="w-full relative">
          <label
            htmlFor="imageName"
            className="
          text-base font-bold text-gray-900"
          >
            Imagen del producto:
          </label>
          <input
            {...register('imageName')}
            onChange={handleFile}
            type="file"
            name="imageName"
            id="imageName"
            accept="image/png, image/jpeg, image/webp"
            className=" border h-10 w-full 
        border-gray-400 p-2 rounded
        placeholder-shown:border-b-gray-400 
          focus:outline-none 
          focus:ring-2 
          focus:ring-gray-400 
          focus:border-transparent"
            placeholder=" "
          />
          {errors.imageName && <span className="text-red-800 font-bold">{errors.imageName.message}</span>}
        </div>
        {/* input precio */}
        <div className="w-full relative">
          <label htmlFor="price" className="text-base font-bold text-gray-900">
            Precio:
          </label>
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
            placeholder="100.000"
          />

          {errors.price && <span className="text-red-800 font-bold">{errors.price.message}</span>}
        </div>
        {/* input tags */}
        <div className="w-full relative">
          <label
            htmlFor="tags"
            className="
            text-base font-bold text-gray-900"
          >
            Tags:
          </label>
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
            placeholder="TV Box, Android, Smart TV, Netflix, YouTube, Spotify, Prime Video, Bluetooth"
          />
          {errors.tags && <span className="text-red-800 font-bold">{errors.tags.message}</span>}
        </div>
        {/* input featured */}
        <div className="w-full relative flex flex-col">
          <label htmlFor="featured" className="text-base font-bold text-gray-900">
            Destacado:
          </label>
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
        </div>
        {/* input caracteristicas */}
        <div className="w-full relative">
          <label
            htmlFor="caracteristicas"
            className="
            text-base font-bold text-gray-900"
          >
            Caracteristicas:
          </label>
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
            placeholder="Convierte cualquier televisor en Smart TV, Compatible con Netflix, YouTube, Prime Video, Spotify, entre otras apps, Conexión HDMI y WiFi, Incluye control remoto multifunción, Interfaz Android fácil de usar, Soporte de 2GB RAM y 16GB almacenamiento"
          />
          {errors.caracteristicas && <span className="text-red-800 font-bold">{errors.caracteristicas.message}</span>}
        </div>
        {/* input content */}
        <div className="w-full relative">
          <label
            htmlFor="content"
            className="
            text-base font-bold text-gray-900 "
          >
            Descripcion:
          </label>
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
          peer border h-20 w-full 
        border-gray-400 p-2 rounded
        placeholder-shown:border-b-gray-400 
          focus:outline-none 
          focus:ring-2 
        focus:ring-gray-400 
          focus:border-transparent"
            placeholder="Disfruta de tus plataformas favoritas directamente en tu televisor con esta TV Box Android. Accede a aplicaciones como Netflix, YouTube, Prime Video, Spotify y más. Fácil de instalar y usar, ideal para modernizar tu entretenimiento."
          ></textarea>
          {errors.content && <span className="text-red-800 font-bold">{errors.content.message}</span>}
        </div>
        <div>
          <button className="py-2 px-4 bg-amber-600 w-full text-gray-50"> Enviar</button>
        </div>
      </form>
    </div>
  )
}
