import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function CartPage() {
  const { lines, itemCount, subtotal, loading, syncing, error, setQuantity, removeProduct, clearCart } = useCart()
  const shipping = subtotal >= 149 || subtotal === 0 ? 0 : 14.9
  const total = subtotal + shipping

  if (loading) return <section className="mx-auto min-h-[60vh] max-w-6xl px-5 py-12 sm:px-8"><p className="text-stone-600">Carregando seu carrinho…</p></section>

  return (
    <section className="mx-auto min-h-[65vh] max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-black tracking-widest text-forest-700 uppercase">Sua compra</p><h1 className="mt-2 text-3xl font-black text-forest-950">Carrinho</h1><p className="mt-2 text-sm text-stone-500">{itemCount} {itemCount === 1 ? 'item selecionado' : 'itens selecionados'}</p></div>
        {lines.length > 0 && <button className="text-sm font-bold text-red-700 hover:underline" onClick={clearCart} type="button">Limpar carrinho</button>}
      </div>

      {error && <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="status">{error}</p>}
      {syncing && <p className="mt-3 text-xs text-stone-500">Sincronizando com sua conta…</p>}

      {lines.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm"><span className="text-5xl" aria-hidden="true">🛒</span><h2 className="mt-4 text-2xl font-black text-forest-950">Seu carrinho está vazio</h2><p className="mt-2 text-stone-500">Explore o catálogo e adicione seus produtos favoritos.</p><Link className="mt-6 inline-flex rounded-xl bg-sun-400 px-6 py-3 font-extrabold text-forest-950" to="/catalogo">Ver produtos</Link></div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-3">
            {lines.map(({ product, quantity }) => (
              <article className="grid grid-cols-[5.5rem_1fr] gap-4 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:p-4" key={product.id}>
                <img className="aspect-square size-full rounded-xl object-cover" src={product.image} alt="" />
                <div className="min-w-0"><p className="text-xs font-bold text-forest-700 uppercase">{product.category}</p><h2 className="mt-1 font-bold text-stone-900">{product.name}</h2><p className="mt-1 text-sm text-stone-500">{money.format(product.price)} por {product.unit}</p><button className="mt-3 text-xs font-bold text-red-700 hover:underline" onClick={() => removeProduct(product.id)} type="button">Remover</button></div>
                <div className="col-span-2 flex items-center justify-between gap-4 border-t border-stone-100 pt-3 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-right">
                  <div className="inline-flex items-center rounded-xl border border-stone-300"><button className="size-10 text-lg font-bold hover:bg-stone-50" onClick={() => setQuantity(product.id, quantity - 1)} type="button" aria-label={`Diminuir quantidade de ${product.name}`}>−</button><span className="grid min-w-10 place-items-center text-sm font-bold">{quantity}</span><button className="size-10 text-lg font-bold hover:bg-stone-50 disabled:text-stone-300" disabled={quantity >= product.stockQuantity} onClick={() => setQuantity(product.id, quantity + 1)} type="button" aria-label={`Aumentar quantidade de ${product.name}`}>+</button></div>
                  <strong className="block text-lg text-forest-950 sm:mt-3">{money.format(product.price * quantity)}</strong>
                </div>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-36"><h2 className="text-xl font-black text-forest-950">Resumo</h2><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{money.format(subtotal)}</dd></div><div className="flex justify-between"><dt>Entrega</dt><dd className={shipping === 0 ? 'font-bold text-emerald-700' : ''}>{shipping === 0 ? 'Grátis' : money.format(shipping)}</dd></div><div className="flex justify-between border-t border-stone-200 pt-4 text-lg font-black"><dt>Total</dt><dd>{money.format(total)}</dd></div></dl>{subtotal < 149 && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">Faltam {money.format(149 - subtotal)} para ganhar frete grátis.</p>}<Link className="mt-5 flex w-full items-center justify-center rounded-xl bg-sun-400 px-5 py-3.5 font-extrabold text-forest-950 transition hover:bg-sun-300" to="/checkout">Continuar para entrega</Link><Link className="mt-3 block text-center text-sm font-bold text-forest-700 hover:underline" to="/catalogo">Continuar comprando</Link></aside>
        </div>
      )}
    </section>
  )
}
