import { supabase } from '../lib/supabase'
import type { Product } from '../types/product'

type ProductRow = {
  id: string
  slug: string
  name: string
  image_url: string | null
  price: number | string
  compare_at_price: number | string | null
  unit: string
  stock_quantity: number | string
  featured: boolean
  categories: { name: string; slug: string } | { name: string; slug: string }[] | null
}

const productColumns = 'id, slug, name, image_url, price, compare_at_price, unit, stock_quantity, featured, categories!inner(name, slug)'

function getCategory(row: ProductRow) {
  return Array.isArray(row.categories) ? row.categories[0] : row.categories
}

function productScore(slug: string) {
  return [...slug].reduce((total, character) => total + character.charCodeAt(0), 0)
}

export function mapProduct(row: ProductRow): Product {
  const category = getCategory(row)
  const score = productScore(row.slug)
  const price = Number(row.price)
  const originalPrice = row.compare_at_price == null ? undefined : Number(row.compare_at_price)

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: category?.name ?? 'Mercado',
    categorySlug: category?.slug ?? '',
    image: row.image_url ?? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=640&q=80',
    price,
    originalPrice,
    unit: row.unit,
    badge: originalPrice ? 'Oferta' : row.featured ? 'Destaque' : undefined,
    rating: Number((4.5 + (score % 6) / 10).toFixed(1)),
    reviews: 38 + (score % 247),
    stockQuantity: Number(row.stock_quantity),
    featured: row.featured,
  }
}

export async function getProducts() {
  if (!supabase) throw new Error('Supabase não configurado.')
  const { data, error } = await supabase
    .from('products')
    .select(productColumns)
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('name')

  if (error) throw error
  return (data as unknown as ProductRow[]).map(mapProduct)
}

export async function getProductBySlug(slug: string) {
  if (!supabase) throw new Error('Supabase não configurado.')
  const { data, error } = await supabase
    .from('products')
    .select(productColumns)
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle()
  if (error) throw error
  return data ? mapProduct(data as unknown as ProductRow) : null
}
