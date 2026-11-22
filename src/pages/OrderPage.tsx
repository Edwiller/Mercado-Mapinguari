import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getOrder, type OrderSummary } from '../services/account'

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' })
const statusLabel: Record<string, string> = { pending: 'Pedido recebido', confirmed: 'Confirmado', preparing: 'Em separação', out_for_delivery: 'Saiu para entrega', delivered: 'Entregue', cancelled: 'Cancelado' }

export function OrderPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState<OrderSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getOrder(id).then((data) => active && setOrder(data)).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id])

  if (loading) return <section className="mx-auto min-h-[60vh] max-w-4xl px-5 py-12">Carregando pedido…</section>
  if (!order) return <section className="mx-auto min-h-[60vh] max-w-4xl px-5 py-12"><h1 className="text-2xl font-black text-forest-950">Pedido não encontrado</h1><Link className="mt-5 inline-block font-bold text-forest-700" to="/conta">Voltar à conta</Link></section>

  return <section className="mx-auto min-h-[65vh] max-w-4xl px-4 py-8 sm:px-8 sm:py-12">
    {(location.state as { justCreated?: boolean } | null)?.justCreated && <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-900"><strong className="text-lg">✓ Pedido realizado com sucesso!</strong><p className="mt-1 text-sm">A operação é demonstrativa e nenhuma cobrança real foi feita.</p></div>}
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black tracking-widest text-forest-700 uppercase">Pedido #{order.order_number}</p><h1 className="mt-2 text-3xl font-black text-forest-950">{statusLabel[order.status] ?? order.status}</h1><p className="mt-2 text-sm text-stone-500">Criado em {date.format(new Date(order.created_at))}</p></div><span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900">{statusLabel[order.status] ?? order.status}</span></div>
      <div className="mt-8 divide-y divide-stone-100">{order.order_items.map((item, index) => <div className="flex justify-between gap-4 py-4 text-sm" key={`${item.product_name}-${index}`}><div><strong className="text-stone-900">{item.product_name}</strong><p className="mt-1 text-stone-500">{item.quantity} × {item.unit}</p></div><strong>{money.format(item.line_total)}</strong></div>)}</div>
      <dl className="ml-auto mt-6 max-w-sm space-y-2 border-t border-stone-200 pt-5 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{money.format(order.subtotal)}</dd></div><div className="flex justify-between"><dt>Desconto</dt><dd>- {money.format(order.discount)}</dd></div><div className="flex justify-between"><dt>Entrega</dt><dd>{money.format(order.shipping_fee)}</dd></div><div className="flex justify-between pt-2 text-lg font-black"><dt>Total</dt><dd>{money.format(order.total)}</dd></div></dl>
      {order.addresses && <div className="mt-8 rounded-2xl bg-stone-50 p-5"><h2 className="font-black text-forest-950">Entrega em {order.addresses.label}</h2><p className="mt-2 text-sm text-stone-600">{order.addresses.street}, {order.addresses.number} — {order.addresses.neighborhood}<br />{order.addresses.city}/{order.addresses.state}</p></div>}
    </div><div className="mt-6 flex flex-wrap gap-3"><Link className="rounded-xl bg-forest-800 px-5 py-3 text-sm font-bold text-white" to="/catalogo">Comprar novamente</Link><Link className="rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-bold text-stone-700" to="/conta">Meus pedidos</Link></div>
  </section>
}
