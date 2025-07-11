import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
const url = import.meta.env.PUBLIC_URL

export default function FormFunction() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()
  const [file, setFile] = useState(null)
  const [base64IMG, setBase64IMG] = useState('')
  const [featured, setfeatured] = useState(false)

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
        alert(data)
      })
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
    <section className="container absolute z-10 top-50 left-50 w-80 h-80 bg-amber-300">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="title">
          Nombre del producto:
          <input
            {...register('title', {
              required: { value: true, message: 'El producto debe de tener un nombre' },
              validate: value => value.trim().length > 0 || 'El nombre no puede ser solo espacios',
            })}
            type="text"
            name="title"
            id="title"
          />
          {errors.title && <span>{errors.title.message}</span>}
        </label>
        <label htmlFor="imageName">
          Imagen:
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
          />
          {errors.imageName && <span>{errors.imageName.message}</span>}
        </label>
        <label htmlFor="price">
          Precio:
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
          />
          {errors.price && <span>{errors.price.message}</span>}
        </label>
        <label htmlFor="tags">
          Tags:
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
          />
          {errors.tags && <span>{errors.tags.message}</span>}
        </label>
        <label htmlFor="featured">
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
        <label htmlFor="caracteristicas">
          Caracteristicas:
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
          />
          {errors.caracteristicas && <span>{errors.caracteristicas.message}</span>}
        </label>
        <label htmlFor="content">
          Descripcion:
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
          ></textarea>
          {errors.content && <span>{errors.content.message}</span>}
        </label>
        <div>
          <button> Enviar</button>
        </div>
      </form>
    </section>
  )
}
