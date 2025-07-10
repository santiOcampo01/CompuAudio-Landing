import { useState, useEffect } from 'react'
const url = import.meta.env.PUBLIC_URL

export default function EditProductComponent({ productEdit }) {
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

  function handleSubmit(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    console.log(data)
    if (data.imageName.size == 0) {
      delete data.imageName
    } else {
      data.imageName = data.imageName.name
      data.imageBase64 = base64IMG
    }
    data.tags = JSON.stringify(data.tags.split(','))
    data.caracteristicas = JSON.stringify(data.caracteristicas.split(','))
    data.featured = featured
    data.sha = productEdit.sha
    updateProduct(data)
  }

  return (
    <div className="container absolute z-10 top-50 left-50 w-80 h-80 bg-amber-300">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          Nombre del producto:
          <input defaultValue={productEdit.title} type="text" name="title" id="title" required />
        </label>
        <label htmlFor="imageName">
          Imagen:
          <input onChange={handleFile} type="file" name="imageName" id="imageName" accept="image/png, image/jpeg, image/webp" />
        </label>
        <label htmlFor="price">
          Precio:
          <input defaultValue={productEdit.price} type="number" name="price" id="price" required />
        </label>
        <label htmlFor="tags">
          Tags:
          <input defaultValue={productEdit.tags} type="text" name="tags" id="tags" required />
        </label>
        <label htmlFor="featured">
          Destacado:
          <input
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
          <input defaultValue={productEdit.caracteristicas} type="text" name="caracteristicas" id="caracteristicas" required />
        </label>
        <label htmlFor="content">
          Descripcion:
          <textarea defaultValue={productEdit.content} id="content" name="content" required></textarea>
        </label>
        <div>
          <button type="submit"> Enviar</button>
        </div>
      </form>
    </div>
  )
}
