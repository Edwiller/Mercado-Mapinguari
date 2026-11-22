import { createContext } from 'react'
import type { Product } from '../types/product'

export type CartLine = { product: Product; quantity: number }

export type CartContextValue = {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  loading: boolean
  syncing: boolean
  error: string
  addProduct: (product: Product) => void
  setQuantity: (productId: string, quantity: number) => void
  removeProduct: (productId: string) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)
