import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
const url = import.meta.env.PUBLIC_URL

export default function EditProductComponent({ productEdit }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      title: productEdit.title,
      price: productEdit.price,
      tags: productEdit.tags,
      caracteristicas: productEdit.caracteristicas,
      content: productEdit.content,
    },
  })

  const [featured, setfeatured] = useState(productEdit.featured)
  const [base64IMG, setBase64IMG] = useState('')

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
          console.log(data)
        })
    } catch (err) {
      alert(err.message)
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

  const onSubmit = data => console.log(data)

  // function handleSubmit(e) {
  //   e.preventDefault()
  //   const data = Object.fromEntries(new FormData(e.target))
  //   console.log(data)
  //   if (data.imageName.size == 0) {
  //     delete data.imageName
  //   } else {
  //     data.imageName = data.imageName.name
  //     data.imageBase64 = base64IMG
  //   }
  //   data.tags = JSON.stringify(data.tags.split(','))
  //   data.caracteristicas = JSON.stringify(data.caracteristicas.split(','))
  //   data.featured = featured
  //   data.sha = productEdit.sha
  //   console.log(data)
  //   // updateProduct(data)
  // }

  return (
    <div className="container absolute z-10 top-50 left-50 w-80 h-80 bg-amber-300">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="title">
          Nombre del producto:
          <input
            {...register('title', {
              required: { value: true, message: 'El producto debe de tener un nombre' },
              validate: value =>
                value.trim().length > 0 || 'El nombre no puede ser solo espacios',
            })}
            type="text"
            name="title"
            id="title"
          />
          {errors.title?.type == 'required' && <span>{errors.title.message}</span>}
          {errors.title?.type == 'validate' && <span>{errors.title.message}</span>}
        </label>

        <label htmlFor="imageName">
          Imagen:
          <input
            {...register('imageName')}
            onChange={handleFile}
            type="file"
            name="imageName"
            id="imageName"
            accept="image/png, image/jpeg, image/webp"
          />
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
                message: 'El precio del producto no puede ser negativo',
              }       
            })}
            type="number"
            name="price"
            id="price"
          />
          {errors.price?.type == 'required' && <span>{errors.price.message}</span>}
          {errors.price?.type == 'min' && <span>{errors.price.message}</span>}
        </label>

        <label htmlFor="tags">
          Tags:
          <input {...register('tags')} type="text" name="tags" id="tags" />
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
          <input {...register('caracteristicas')} type="text" name="caracteristicas" id="caracteristicas" />
        </label>

        <label htmlFor="content">
          Descripcion:
          <textarea {...register('content')} id="content" name="content"></textarea>
        </label>

        <div>
          <button> Enviar</button>
        </div>
      </form>
    </div>
  )
}
