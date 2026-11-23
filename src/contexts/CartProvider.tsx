import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { getProducts } from '../services/catalog'
import { analyticsItem, trackEvent } from '../lib/analytics'
import type { Product } from '../types/product'
import { CartContext, type CartLine } from './cart-context'

const storageKey = 'mercado-mapinguari-cart-v1'

function loadLocalCart(): CartLine[] {
  try {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return []
    const parsed = JSON.parse(saved) as CartLine[]
    return Array.isArray(parsed) ? parsed.filter((line) => line?.product?.id && line.quantity > 0) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [lines, setLines] = useState<CartLine[]>(loadLocalCart)
  const [loading, setLoading] = useState(authLoading)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState('')
  const cartIdRef = useRef<string | null>(null)
  const userIdRef = useRef<string | null>(null)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(lines))
  }, [lines])

  useEffect(() => {
    if (authLoading) return
    userIdRef.current = user?.id ?? null
    cartIdRef.current = null

    if (!user || !supabase) {
      Promise.resolve().then(() => setLoading(false))
      return
    }

    let active = true
    const client = supabase
    const localLines = loadLocalCart()

    const loadRemoteCart = async () => {
      setLoading(true)
      setError('')
      const { data: cart, error: cartError } = await client
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle()
      if (cartError) throw cartError
      if (!active) return

      if (!cart) {
        setLines(localLines)
        if (localLines.length) {
          const { data: created, error: createError } = await client
            .from('carts')
            .insert({ user_id: user.id })
            .select('id')
            .single()
          if (createError) throw createError
          cartIdRef.current = created.id
          const { error: mergeError } = await client.from('cart_items').upsert(
            localLines.map((line) => ({ cart_id: created.id, product_id: line.product.id, quantity: line.quantity })),
            { onConflict: 'cart_id,product_id' },
          )
          if (mergeError) throw mergeError
        }
        return
      }

      cartIdRef.current = cart.id
      const [{ data: items, error: itemsError }, products] = await Promise.all([
        client.from('cart_items').select('product_id, quantity').eq('cart_id', cart.id),
        getProducts(),
      ])
      if (itemsError) throw itemsError
      if (!active) return

      const productMap = new Map(products.map((product) => [product.id, product]))
      const remoteLines = (items ?? []).flatMap((item) => {
        const product = productMap.get(item.product_id)
        return product ? [{ product, quantity: Number(item.quantity) }] : []
      })
      setLines(remoteLines.length ? remoteLines : localLines)
      if (!remoteLines.length && localLines.length) {
        const { error: mergeError } = await client.from('cart_items').upsert(
          localLines.map((line) => ({ cart_id: cart.id, product_id: line.product.id, quantity: line.quantity })),
          { onConflict: 'cart_id,product_id' },
        )
        if (mergeError) throw mergeError
      }
    }

    void loadRemoteCart()
      .catch(() => {
        if (active) setError('O carrinho foi mantido neste dispositivo, mas não sincronizou com sua conta.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [authLoading, user])

  const ensureRemoteCart = async () => {
    if (!supabase || !userIdRef.current) return null
    if (cartIdRef.current) return cartIdRef.current

    const { data: existing, error: findError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userIdRef.current)
      .eq('status', 'active')
      .maybeSingle()
    if (findError) throw findError
    if (existing) {
      cartIdRef.current = existing.id
      return existing.id
    }

    const { data: created, error: createError } = await supabase
      .from('carts')
      .insert({ user_id: userIdRef.current })
      .select('id')
      .single()
    if (createError) throw createError
    cartIdRef.current = created.id
    return created.id
  }

  const syncLine = (productId: string, quantity: number) => {
    if (!userIdRef.current || !supabase) return
    setSyncing(true)
    setError('')
    void ensureRemoteCart()
      .then(async (cartId) => {
        if (!cartId || !supabase) return
        if (quantity <= 0) {
          const { error: deleteError } = await supabase.from('cart_items').delete().eq('cart_id', cartId).eq('product_id', productId)
          if (deleteError) throw deleteError
        } else {
          const { error: upsertError } = await supabase
            .from('cart_items')
            .upsert({ cart_id: cartId, product_id: productId, quantity }, { onConflict: 'cart_id,product_id' })
          if (upsertError) throw upsertError
        }
      })
      .catch(() => setError('Não foi possível sincronizar a última alteração.'))
      .finally(() => setSyncing(false))
  }

  const addProduct = (product: Product) => {
    const existing = lines.find((line) => line.product.id === product.id)
    const nextQuantity = Math.min((existing?.quantity ?? 0) + 1, product.stockQuantity)
    setLines((current) => existing
      ? current.map((line) => line.product.id === product.id ? { ...line, quantity: nextQuantity } : line)
      : [...current, { product, quantity: nextQuantity }])
    if (nextQuantity > (existing?.quantity ?? 0)) trackEvent('add_to_cart', { currency: 'BRL', value: product.price, items: [analyticsItem(product)] })
    syncLine(product.id, nextQuantity)
  }

  const setQuantity = (productId: string, quantity: number) => {
    const line = lines.find((item) => item.product.id === productId)
    if (!line) return
    const safeQuantity = Math.max(0, Math.min(quantity, line.product.stockQuantity))
    const difference = safeQuantity - line.quantity
    if (difference > 0) trackEvent('add_to_cart', { currency: 'BRL', value: line.product.price * difference, items: [analyticsItem(line.product, difference)] })
    if (difference < 0) trackEvent('remove_from_cart', { currency: 'BRL', value: line.product.price * Math.abs(difference), items: [analyticsItem(line.product, Math.abs(difference))] })
    setLines((current) => safeQuantity === 0 ? current.filter((item) => item.product.id !== productId) : current.map((item) => item.product.id === productId ? { ...item, quantity: safeQuantity } : item))
    syncLine(productId, safeQuantity)
  }

  const removeProduct = (productId: string) => setQuantity(productId, 0)

  const clearCart = () => {
    setLines([])
    const previousCartId = cartIdRef.current
    cartIdRef.current = null
    if (!supabase || !previousCartId) return
    const client = supabase
    const cartId = previousCartId
    setSyncing(true)
    void (async () => {
      try {
        const { error: clearError } = await client.from('cart_items').delete().eq('cart_id', cartId)
        if (clearError) setError('Não foi possível limpar o carrinho remoto.')
      } finally {
        setSyncing(false)
      }
    })()
  }

  const value = {
    lines,
    itemCount: lines.reduce((total, line) => total + line.quantity, 0),
    subtotal: lines.reduce((total, line) => total + line.product.price * line.quantity, 0),
    loading,
    syncing,
    error,
    addProduct,
    setQuantity,
    removeProduct,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
