import { useState } from 'react'

export default function FormFunction() {
  const [file, setFile] = useState(null)
  const [base64IMG, setBase64IMG] = useState('')
  const [tags, setTags] = useState([])

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
    data.tags = data.tags.slice(',')
    console.log(data)
  }

  return (
    <section className="container absolute z-10 top-50 left-50 w-80 h-80 bg-amber-300">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          Nombre del producto:
          <input type="text" name="title" id="title" required />
        </label>
        <label htmlFor="imageName">
          Nombre del producto:
          <input onChange={handleFile} type="file" name="imageName" id="imageName" accept="image/png, image/jpeg, image/webp" required />
        </label>
        <label htmlFor="price">
          Precio:
          <input type="number" name="price" id="price" required />
        </label>
        <label htmlFor="tags">
          Tags:
          <input type="text" name="tags" id="tags" required />
        </label>
        <label htmlFor="tags">
          Destacado:
          <input type="checkbox" name="tags" id="Destacado" />
        </label>
        <label htmlFor="tags">
          Caracteristicas:
          <input type="text" name="tags" id="Caracteristicas" required />
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
