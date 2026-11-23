import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AddressForm } from '../components/AddressForm'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { checkoutCart, createAddress, getAddresses, type Address, type AddressInput } from '../services/account'
import { analyticsItem, trackEvent } from '../lib/analytics'

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function checkoutError(error: unknown) {
  const message = error instanceof Error ? error.message : ''
  if (message.includes('EMPTY_CART')) return 'Seu carrinho está vazio.'
  if (message.includes('INSUFFICIENT_STOCK')) return 'Um produto ficou sem estoque. Revise o carrinho.'
  if (message.includes('INVALID_COUPON')) return 'Cupom inválido ou expirado.'
  if (message.includes('COUPON_MINIMUM')) return 'O valor mínimo do cupom ainda não foi alcançado.'
  return 'Não foi possível concluir o pedido. Tente novamente.'
}

export function CheckoutPage() {
  const { user } = useAuth()
  const { lines, subtotal, loading: cartLoading, syncing, clearCart } = useCart()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressId, setAddressId] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [savingAddress, setSavingAddress] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [completedOrderId, setCompletedOrderId] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('pix_demo')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const checkoutTracked = useRef(false)

  useEffect(() => {
    let active = true
    getAddresses().then((data) => {
      if (!active) return
      setAddresses(data)
      setAddressId(data.find((address) => address.is_default)?.id ?? data[0]?.id ?? '')
      setShowAddressForm(data.length === 0)
    }).catch(() => active && setError('Não foi possível carregar seus endereços.')).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (cartLoading || checkoutTracked.current || !lines.length) return
    checkoutTracked.current = true
    trackEvent('begin_checkout', {
      currency: 'BRL',
      value: subtotal,
      items: lines.map((line, index) => analyticsItem(line.product, line.quantity, index)),
    })
  }, [cartLoading, lines, subtotal])

  if (!cartLoading && lines.length === 0 && !submitting && !completedOrderId) return <Navigate to="/carrinho" replace />

  const saveAddress = async (input: AddressInput) => {
    if (!user) return
    setSavingAddress(true)
    try {
      const created = await createAddress(user.id, { ...input, is_default: addresses.length === 0 })
      setAddresses((current) => [...current, created])
      setAddressId(created.id)
      setShowAddressForm(false)
    } finally {
      setSavingAddress(false)
    }
  }

  const submit = async () => {
    setError('')
    if (!addressId) return setError('Escolha um endereço de entrega.')
    setSubmitting(true)
    try {
      const order = await checkoutCart({ addressId, couponCode, paymentMethod, notes })
      trackEvent('purchase', {
        transaction_id: order.order_id,
        currency: 'BRL',
        value: Number(order.total),
        shipping,
        coupon: couponCode.trim() || undefined,
        payment_type: paymentMethod,
        items: lines.map((line, index) => analyticsItem(line.product, line.quantity, index)),
      })
      setCompletedOrderId(order.order_id)
      navigate(`/pedidos/${order.order_id}`, { replace: true, state: { justCreated: true } })
      clearCart()
    } catch (caughtError) {
      setError(checkoutError(caughtError))
    } finally {
      setSubmitting(false)
    }
  }

  const shipping = subtotal >= 149 ? 0 : 14.9

  return <section className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
    <p className="text-xs font-black tracking-widest text-forest-700 uppercase">Finalizar compra</p><h1 className="mt-2 text-3xl font-black text-forest-950">Entrega e pagamento</h1>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black text-forest-950">1. Endereço de entrega</h2>{addresses.length > 0 && <button className="text-sm font-bold text-forest-700 hover:underline" onClick={() => setShowAddressForm((value) => !value)} type="button">{showAddressForm ? 'Fechar' : 'Novo endereço'}</button>}</div>
          {loading ? <p className="mt-4 text-sm text-stone-500">Carregando…</p> : showAddressForm ? <div className="mt-5"><AddressForm saving={savingAddress} onSave={saveAddress} onCancel={addresses.length ? () => setShowAddressForm(false) : undefined} /></div> : <div className="mt-4 grid gap-3 sm:grid-cols-2">{addresses.map((address) => <label className={`cursor-pointer rounded-xl border p-4 ${addressId === address.id ? 'border-forest-700 bg-forest-50 ring-2 ring-green-100' : 'border-stone-200'}`} key={address.id}><input className="sr-only" type="radio" name="address" value={address.id} checked={addressId === address.id} onChange={() => setAddressId(address.id)} /><strong className="text-forest-950">{address.label}</strong><span className="mt-1 block text-sm text-stone-600">{address.street}, {address.number}<br />{address.neighborhood} — {address.city}/{address.state}</span></label>)}</div>}
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"><h2 className="text-xl font-black text-forest-950">2. Pagamento demonstrativo</h2><p className="mt-2 text-sm text-stone-500">Nenhuma cobrança real será realizada.</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{[['pix_demo','PIX demonstrativo','⚡'],['card_demo','Cartão demonstrativo','💳'],['wallet_demo','Carteira demonstrativa','📱']].map(([value,label,icon]) => <label className={`cursor-pointer rounded-xl border p-4 text-sm font-bold ${paymentMethod === value ? 'border-forest-700 bg-forest-50 ring-2 ring-green-100' : 'border-stone-200'}`} key={value}><input className="sr-only" type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} /><span className="mr-2 text-xl">{icon}</span>{label}</label>)}</div></section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"><h2 className="text-xl font-black text-forest-950">3. Observações</h2><textarea className="mt-4 min-h-24 w-full rounded-xl border border-stone-300 p-3 outline-none focus:border-forest-700 focus:ring-3 focus:ring-green-100" maxLength={300} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ex.: deixar na portaria" /></section>
      </div>

      <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-36"><h2 className="text-xl font-black text-forest-950">Resumo do pedido</h2><p className="mt-2 text-sm text-stone-500">{lines.length} produtos no carrinho</p><label className="mt-5 block text-sm font-bold text-stone-700">Cupom<input className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2.5 font-normal uppercase outline-none focus:border-forest-700" value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} placeholder="BEMVINDO" /></label><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{money.format(subtotal)}</dd></div><div className="flex justify-between"><dt>Entrega</dt><dd>{shipping ? money.format(shipping) : 'Grátis'}</dd></div><div className="flex justify-between border-t border-stone-200 pt-4 text-lg font-black"><dt>Total estimado</dt><dd>{money.format(subtotal + shipping)}</dd></div></dl>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800" role="alert">{error}</p>}<button className="mt-5 w-full rounded-xl bg-sun-400 px-5 py-3.5 font-extrabold text-forest-950 disabled:cursor-not-allowed disabled:opacity-50" disabled={submitting || syncing || !addressId} onClick={submit} type="button">{submitting ? 'Criando pedido…' : 'Confirmar pedido'}</button><Link className="mt-3 block text-center text-sm font-bold text-forest-700 hover:underline" to="/carrinho">Voltar ao carrinho</Link></aside>
    </div>
  </section>
}
