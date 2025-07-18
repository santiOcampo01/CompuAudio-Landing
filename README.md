# CompuAudio

CompuAudio es una tienda online de productos de audio y tecnología, desarrollada con un enfoque moderno y eficiente tanto en frontend como en backend.

## Características principales

- **Frontend:**
  - Construido con [Astro](https://astro.build/) y JavaScript para una experiencia rápida y responsiva.
  - Sección de administración desarrollada con React para facilitar la gestión de productos.
  - Visualización de productos, carrito de compras, testimonios, contacto y más.
  - Cada producto se almacena como un archivo Markdown individual en `src/content/products`, y su imagen correspondiente en `public/productsImages`.

- **Backend:**
  - Desarrollado en Node.js.
  - Maneja la autenticación del administrador y las peticiones para crear, editar o eliminar productos.
  - Conexión con la API de GitHub: los productos se gestionan como archivos Markdown en el repositorio, permitiendo un control de versiones y edición colaborativa.

## Estructura del proyecto

- `compuAudio/`: Frontend (Astro, JS, React para admin)
- `backCompuAudio/`: Backend (Node.js, API REST, conexión GitHub)

## ¿Cómo se gestionan los productos?

1. **Agregar producto:**
   - Se crea un nuevo archivo Markdown en `src/content/products` con la información del producto.
   - Se sube la imagen correspondiente a `public/productsImages`.
   - El backend actualiza el repositorio de GitHub para reflejar los cambios.

2. **Editar producto:**
   - Se modifica el archivo Markdown correspondiente y/o la imagen.
   - El backend sincroniza los cambios con GitHub.

## Instalación y uso

1. Clona el repositorio y navega a las carpetas `compuAudio` y `backCompuAudio` para instalar dependencias:
   ```bash
   cd compuAudio
   npm install
   ```
2. Configura las variables de entorno necesarias para la conexión con GitHub y la autenticación.
3. Inicia ambos servidores (frontend y backend) según la documentación interna de cada carpeta.

## Tecnologías utilizadas

- Astro
- JavaScript
- React (admin)
- Node.js
- GitHub API

---
Desarrollado por Santi. Para dudas o sugerencias, contacta al autor.
