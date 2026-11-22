import { supabase } from '../lib/supabase'

export type Address = {
  id: string
  label: string
  recipient_name: string
  postal_code: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  reference: string | null
  is_default: boolean
}

export type AddressInput = Omit<Address, 'id' | 'is_default'> & { is_default?: boolean }

export type OrderSummary = {
  id: string
  order_number: number
  status: string
  payment_method: string
  subtotal: number
  discount: number
  shipping_fee: number
  total: number
  created_at: string
  addresses: { label: string; street: string; number: string; neighborhood: string; city: string; state: string } | null
  order_items: { product_name: string; quantity: number; unit: string; line_total: number }[]
}

function requireClient() {
  if (!supabase) throw new Error('Supabase não configurado.')
  return supabase
}

export async function getAddresses() {
  const client = requireClient()
  const { data, error } = await client.from('addresses').select('*').order('is_default', { ascending: false }).order('created_at')
  if (error) throw error
  return data as Address[]
}

export async function createAddress(userId: string, input: AddressInput) {
  const client = requireClient()
  const { data, error } = await client.from('addresses').insert({ ...input, user_id: userId }).select('*').single()
  if (error) throw error
  return data as Address
}

export async function deleteAddress(id: string) {
  const client = requireClient()
  const { error } = await client.from('addresses').delete().eq('id', id)
  if (error) throw error
}

export async function getOrders() {
  const client = requireClient()
  const { data, error } = await client
    .from('orders')
    .select('id, order_number, status, payment_method, subtotal, discount, shipping_fee, total, created_at, addresses(label, street, number, neighborhood, city, state), order_items(product_name, quantity, unit, line_total)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as OrderSummary[]
}

export async function getOrder(id: string) {
  const orders = await getOrders()
  return orders.find((order) => order.id === id) ?? null
}

export async function updateProfile(id: string, fullName: string, phone: string) {
  const client = requireClient()
  const { error } = await client.from('profiles').update({ full_name: fullName.trim(), phone: phone.trim() || null }).eq('id', id)
  if (error) throw error
}

export async function checkoutCart(input: { addressId: string; couponCode: string; paymentMethod: string; notes: string }) {
  const client = requireClient()
  const { data, error } = await client.rpc('checkout_cart', {
    p_address_id: input.addressId,
    p_coupon_code: input.couponCode.trim() || null,
    p_payment_method: input.paymentMethod,
    p_idempotency_key: crypto.randomUUID(),
    p_notes: input.notes.trim() || null,
  })
  if (error) throw error
  const result = (data as { order_id: string; order_number: number; total: number }[] | null)?.[0]
  if (!result) throw new Error('Pedido não retornado pelo servidor.')
  return result
}
