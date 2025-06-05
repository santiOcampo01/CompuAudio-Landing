import { defineCollection, z } from "astro:content";

const products = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    image: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().optional(),
    caracteristicas: z.array(z.string()).optional(),
  }),
})

const testimonios = defineCollection({
  schema: z.object({
    nombre: z.string(),
    mensaje: z.string(),
    imagen: z.string().url(),
    rating: z.number().min(1).max(5),
  }),
})

export const collections = { products, testimonios } 