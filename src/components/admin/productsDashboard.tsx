import { useEffect, useState } from "react";

interface Product {
  sha: string;
  slug: string;
  title: string;
  imageName: string;
  imageBase64: string;
  price: number;
  description: string;
  category: string;
  tags: string[];
  featured: boolean;
  caracteristicas: string[];
  content: string;
}

export default function ProductsDashboard({ userName }: { userName: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/products", { credentials: "include" })
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const handleDelete = async (slug: string, sha: string) => {
    try {
      const res = await fetch(`http://localhost:4000/products/${slug}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sha }), // Enviamos el sha en el cuerpo
      })

      if (res.ok) {
        setProducts(prev => prev.filter(p => p.sha !== sha))
      } else {
        console.error('Error eliminando producto:', await res.text())
      }
    } catch (error) {
      console.error('Fallo en la petición DELETE:', error)
    }
  }
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: Product = {
      sha: editingProduct?.sha || "", // solo lo mandamos si estamos editando
      slug: editingProduct?.slug || "",
      title: formData.get("title") as string,
      imageName: formData.get("imageName") as string,
      imageBase64: formData.get("imageBase64") as string,
      price: Number(formData.get("price")),
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      tags: (formData.get("tags") as string).split(",").map((t) => t.trim()),
      featured: formData.get("featured") === "on",
      caracteristicas: (formData.get("caracteristicas") as string)
        .split("\n")
        .map((c) => c.trim()),
      content: formData.get("content") as string,
    };

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct
      ? `http://localhost:4000/products/${editingProduct.sha}`
      : `http://localhost:4000/products`;

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const updated = await res.json();
    setProducts((prev) =>
      editingProduct
        ? prev.map((p) => (p.sha === updated.sha ? updated : p))
        : [...prev, updated]
    );
    setIsFormVisible(false);
    setEditingProduct(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result?.toString().split(',')[1] || ''
      const imageName = file.name
      setEditingProduct(prev =>
        prev ? { ...prev, imageBase64: base64, imageName } : { ...initialProduct, imageBase64: base64, imageName },
      )
    }
    reader.readAsDataURL(file)
  }
  
  const initialProduct: Product = {
    sha: "",
    slug: "",
    title: "",
    imageName: "",
    imageBase64: "",
    price: 0,
    description: "",
    category: "",
    tags: [],
    featured: false,
    caracteristicas: [],
    content: "",
  };

  return (
    <section>
      <p>Hello Mr {userName}</p>
      <button onClick={() => {
        setEditingProduct(initialProduct);
        setIsFormVisible(true);
      }}>Agregar Producto</button>

      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <label>Título: <input name="title" defaultValue={editingProduct?.title} /></label>
          <label>Imagen: <input type="file" onChange={handleImageUpload} /></label>
          <label>Precio: <input name="price" type="number" defaultValue={editingProduct?.price} /></label>
          <label>Descripción: <textarea name="description" defaultValue={editingProduct?.description} /></label>
          <label>Categoría: <input name="category" defaultValue={editingProduct?.category} /></label>
          <label>Tags (separados por coma): <input name="tags" defaultValue={editingProduct?.tags.join(", ")} /></label>
          <label>Destacado: <input type="checkbox" name="featured" defaultChecked={editingProduct?.featured} /></label>
          <label>Características (una por línea): <textarea name="caracteristicas" defaultValue={editingProduct?.caracteristicas.join("\n")} /></label>
          <label>Contenido largo: <textarea name="content" defaultValue={editingProduct?.content} /></label>
          <input type="hidden" name="imageName" value={editingProduct?.imageName || ""} />
          <input type="hidden" name="imageBase64" value={editingProduct?.imageBase64 || ""} />
          <button type="submit">{editingProduct?.sha ? "Actualizar" : "Crear"}</button>
          <button type="button" onClick={() => {
            setIsFormVisible(false);
            setEditingProduct(null);
          }}>Cancelar</button>
        </form>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "20px" }}>
        {products.map((p) => (
          <div key={p.sha} style={{ border: "1px solid #ccc", padding: "12px", width: "300px" }}>
            <h3>{p.title}</h3>
            <img src={`data:image/jpeg;base64,${p.imageBase64}`} alt={p.title} style={{ width: "100%" }} />
            <p>{p.description}</p>
            <p><strong>Precio:</strong> ${p.price}</p>
            <p><strong>Categoría:</strong> {p.category}</p>
            <button onClick={() => {
              setEditingProduct(p);
              setIsFormVisible(true);
            }}>Editar</button>
            <button onClick={() => handleDelete(p.sha)}>Eliminar</button>
          </div>
        ))}
      </div>
    </section>
  );
}
