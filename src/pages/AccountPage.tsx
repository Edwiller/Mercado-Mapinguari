import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AddressForm } from '../components/AddressForm'
import { useAuth } from '../hooks/useAuth'
import { createAddress, deleteAddress, getAddresses, getOrders, updateProfile, type Address, type AddressInput, type OrderSummary } from '../services/account'

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const statusLabel: Record<string, string> = { pending: 'Recebido', confirmed: 'Confirmado', preparing: 'Em separação', out_for_delivery: 'Em entrega', delivered: 'Entregue', cancelled: 'Cancelado' }

export function AccountPage() {
  const { user, signOut } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [fullName, setFullName] = useState(user?.user_metadata.full_name ?? '')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    Promise.all([
      getAddresses(),
      getOrders(),
    ]).then(([addressData, orderData]) => {
      if (!active) return
      setAddresses(addressData)
      setOrders(orderData)
    }).catch(() => active && setError('Não foi possível carregar todos os dados da conta.')).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  const handleSignOut = async () => {
    setError('')
    try {
      await signOut()
      navigate('/', { replace: true })
    } catch {
      setError('Não foi possível encerrar a sessão. Tente novamente.')
    }
  }

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault()
    if (!user) return
    setSaving(true); setMessage(''); setError('')
    try {
      await updateProfile(user.id, fullName, phone)
      setMessage('Dados pessoais atualizados.')
    } catch {
      setError('Não foi possível atualizar seus dados.')
    } finally {
      setSaving(false)
    }
  }

  const saveAddress = async (input: AddressInput) => {
    if (!user) return
    setSaving(true)
    try {
      const created = await createAddress(user.id, { ...input, is_default: addresses.length === 0 })
      setAddresses((current) => [...current, created])
      setShowAddressForm(false)
      setMessage('Endereço salvo.')
    } finally {
      setSaving(false)
    }
  }

  const removeAddress = async (id: string) => {
    setError('')
    try {
      await deleteAddress(id)
      setAddresses((current) => current.filter((address) => address.id !== id))
    } catch {
      setError('O endereço não pôde ser removido. Ele pode estar vinculado a um pedido.')
    }
  }

  return <section className="mx-auto min-h-[65vh] max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
    <p className="text-xs font-black tracking-widest text-forest-700 uppercase">Minha conta</p><h1 className="mt-2 text-3xl font-black text-forest-950">Olá, {user?.user_metadata.full_name ?? 'cliente'}!</h1><p className="mt-3 text-stone-600">Gerencie seus dados, endereços e pedidos com segurança.</p>
    {error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800" role="alert">{error}</p>}{message && <p className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-800" role="status">{message}</p>}

    <div className="mt-8 grid gap-6 lg:grid-cols-[18rem_1fr]">
      <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><div className="grid size-14 place-items-center rounded-full bg-forest-50 text-2xl">👤</div><strong className="mt-4 block text-forest-950">{fullName || 'Cliente Mapinguari'}</strong><p className="mt-1 break-all text-sm text-stone-500">{user?.email}</p><nav className="mt-6 space-y-1 text-sm font-bold"><a className="block rounded-lg px-3 py-2 hover:bg-stone-50" href="#pedidos">📦 Meus pedidos</a><a className="block rounded-lg px-3 py-2 hover:bg-stone-50" href="#enderecos">📍 Endereços</a><a className="block rounded-lg px-3 py-2 hover:bg-stone-50" href="#dados">👤 Dados pessoais</a></nav><button className="mt-6 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-bold text-stone-700 hover:bg-stone-50" onClick={handleSignOut} type="button">Sair da conta</button></aside>

      <div className="space-y-6">
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6" id="pedidos"><div className="flex items-center justify-between"><h2 className="text-xl font-black text-forest-950">Meus pedidos</h2><span className="text-sm text-stone-500">{orders.length}</span></div>{loading ? <p className="mt-4 text-sm text-stone-500">Carregando…</p> : orders.length ? <div className="mt-4 divide-y divide-stone-100">{orders.map((order) => <Link className="flex items-center justify-between gap-4 py-4 transition hover:bg-stone-50" to={`/pedidos/${order.id}`} key={order.id}><div><strong className="text-forest-950">Pedido #{order.order_number}</strong><p className="mt-1 text-xs text-stone-500">{date.format(new Date(order.created_at))} • {order.order_items.length} produtos</p></div><div className="text-right"><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">{statusLabel[order.status] ?? order.status}</span><strong className="mt-2 block">{money.format(order.total)}</strong></div></Link>)}</div> : <div className="mt-5 rounded-xl bg-stone-50 p-5 text-center"><p className="text-sm text-stone-600">Você ainda não realizou pedidos.</p><Link className="mt-3 inline-block text-sm font-bold text-forest-700 hover:underline" to="/catalogo">Começar uma compra</Link></div>}</section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6" id="enderecos"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black text-forest-950">Endereços</h2><button className="text-sm font-bold text-forest-700 hover:underline" onClick={() => setShowAddressForm((value) => !value)} type="button">{showAddressForm ? 'Fechar' : 'Adicionar'}</button></div>{showAddressForm && <div className="mt-5 border-t border-stone-100 pt-5"><AddressForm onSave={saveAddress} saving={saving} onCancel={() => setShowAddressForm(false)} /></div>}<div className="mt-4 grid gap-3 sm:grid-cols-2">{addresses.map((address) => <article className="rounded-xl border border-stone-200 p-4" key={address.id}><div className="flex justify-between gap-3"><strong className="text-forest-950">{address.label}</strong>{address.is_default && <span className="text-xs font-bold text-emerald-700">Principal</span>}</div><p className="mt-2 text-sm leading-6 text-stone-600">{address.street}, {address.number}<br />{address.neighborhood} — {address.city}/{address.state}<br />CEP {address.postal_code}</p><button className="mt-3 text-xs font-bold text-red-700 hover:underline" onClick={() => void removeAddress(address.id)} type="button">Remover</button></article>)}</div></section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6" id="dados"><h2 className="text-xl font-black text-forest-950">Dados pessoais</h2><form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={saveProfile}><label className="text-sm font-bold text-stone-700">Nome completo<input className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 font-normal outline-none focus:border-forest-700" minLength={2} value={fullName} onChange={(event) => setFullName(event.target.value)} required /></label><label className="text-sm font-bold text-stone-700">Telefone<input className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 font-normal outline-none focus:border-forest-700" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(68) 99999-9999" /></label><button className="w-fit rounded-xl bg-forest-800 px-5 py-3 text-sm font-bold text-white disabled:opacity-60 sm:col-span-2" disabled={saving} type="submit">Salvar alterações</button></form></section>
      </div>
    </div>
  </section>
}
