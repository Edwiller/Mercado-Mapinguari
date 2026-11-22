export type Product = {
  id: string
  slug: string
  name: string
  category: string
  categorySlug: string
  image: string
  price: number
  originalPrice?: number
  unit: string
  badge?: string
  rating: number
  reviews: number
  stockQuantity: number
  featured: boolean
}
