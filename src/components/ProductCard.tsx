import type { Product } from '../types/product'
import { useCart } from '../hooks/useCart'
import { Link } from 'react-router-dom'
import { useState } from 'react'

type ProductCardProps = { product: Product }

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function ProductCard({ product }: ProductCardProps) {
  const { addProduct } = useCart()
  const [favorite, setFavorite] = useState(() => {
    try { return (JSON.parse(localStorage.getItem('mercado-mapinguari-favorites') ?? '[]') as string[]).includes(product.id) } catch { return false }
  })
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <Link className="block size-full" to={`/produto/${product.slug}`} aria-label={`Ver ${product.name}`}><img className="size-full object-cover transition duration-500 group-hover:scale-105" src={product.image} alt={product.name} loading="lazy" /></Link>
        {product.badge && <span className="absolute top-3 left-3 rounded-md bg-forest-800 px-2.5 py-1.5 text-xs font-extrabold text-white shadow-sm">{product.badge}</span>}
        <button className={`absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/95 text-xl shadow-sm transition ${favorite ? 'text-red-600' : 'text-stone-500 hover:text-red-500'}`} type="button" aria-pressed={favorite} aria-label={`${favorite ? 'Remover' : 'Salvar'} ${product.name} ${favorite ? 'dos' : 'nos'} favoritos`} onClick={() => { const next = !favorite; setFavorite(next); try { const saved = JSON.parse(localStorage.getItem('mercado-mapinguari-favorites') ?? '[]') as string[]; localStorage.setItem('mercado-mapinguari-favorites', JSON.stringify(next ? [...new Set([...saved, product.id])] : saved.filter((id) => id !== product.id))) } catch { /* armazenamento indisponível */ } }}>{favorite ? '♥' : '♡'}</button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-bold tracking-wide text-forest-700 uppercase">{product.category}</p>
        <h3 className="mt-2 line-clamp-2 min-h-12 font-bold text-stone-900"><Link className="hover:text-forest-700 hover:underline" to={`/produto/${product.slug}`}>{product.name}</Link></h3>
        <div className="mt-2 flex items-center gap-1 text-xs" aria-label={`${product.rating} de 5 estrelas, ${product.reviews} avaliações`}>
          <span className="tracking-tighter text-amber-500">★★★★★</span><span className="text-stone-500">{product.rating} ({product.reviews})</span>
        </div>
        <div className="mt-4">
          {product.originalPrice && <p className="text-xs text-stone-500"><span className="line-through">{money.format(product.originalPrice)}</span> <strong className="ml-1 text-emerald-700">-{discount}%</strong></p>}
          <p className="mt-0.5 text-2xl font-black text-forest-950">{money.format(product.price)}</p>
          <p className="text-xs text-stone-500">por {product.unit}</p>
        </div>
        <button className="mt-4 w-full rounded-xl bg-sun-400 px-4 py-3 text-sm font-extrabold text-forest-950 transition hover:bg-sun-300 active:scale-[.98] disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500" type="button" disabled={product.stockQuantity <= 0} onClick={() => addProduct(product)}>
          {product.stockQuantity > 0 ? 'Adicionar' : 'Indisponível'}
        </button>
      </div>
    </article>
  )
}
