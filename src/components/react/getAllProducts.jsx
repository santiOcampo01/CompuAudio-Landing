export default function ProducstCards({products}) {
  return (
    <section className="productContainer container px-4 flex ">
      {products.map(product => {
        let key = products.indexOf(product)
        return (
          <article className="productCard gap-5 p-5" key={key + 1}>
            <div className="productInfo">
              <div className="h-[300px]">
                <img className="h-[100%]" src={`../../../public/${product.image}`} width={'100%'} height={'100%'} />
              </div>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <span>{product.price}</span>
            </div>
            <div className="productButton justify-center gap-2">
              <button className="w-[50%] p-3">Editar</button>
              <button className="w-[50%] p-3">Eliminar</button>
            </div>
          </article>
        )
      })}
    </section>
  )
}

