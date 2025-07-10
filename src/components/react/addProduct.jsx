import { useState, useEffect } from 'react'
const url = import.meta.env.PUBLIC_URL

export default function FormFunction() {
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

  function handleSubmit(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    console.log(data)
    data.imageName = data.imageName.name
    data.imageBase64 = base64IMG
    data.tags = JSON.stringify(data.tags.split(','))
    data.caracteristicas = JSON.stringify(data.caracteristicas.split(','))
    data.featured = featured
    console.log(data)
    addProduct(data)
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

  return (
    <section className="container absolute z-10 top-50 left-50 w-80 h-80 bg-amber-300">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          Nombre del producto:
          <input type="text" name="title" id="title" required />
        </label>
        <label htmlFor="imageName">
          Imagen:
          <input onChange={handleFile} type="file" name="imageName" id="imageName" accept="image/png, image/jpeg, image/webp" required />
        </label>
        <label htmlFor="price">
          Precio:
          <input type="number" name="price" id="price" min="1" required />
        </label>
        <label htmlFor="tags">
          Tags:
          <input type="text" name="tags" id="tags" required />
        </label>
        <label htmlFor="featured">
          Destacado:
          <input
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
          <input type="text" name="caracteristicas" id="caracteristicas" required />
        </label>
        <label htmlFor="content">
          Descripcion:
          <textarea defaultValue="Auriculares con sonido envolvente" id="content" name="content" required></textarea>
        </label>
        <div>
          <button type="submit"> Enviar</button>
        </div>
      </form>
    </section>
  )
}
