import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FeedbackState } from '../components/FeedbackState'
import { useCart } from '../hooks/useCart'
import { getProductBySlug } from '../services/catalog'
import type { Product } from '../types/product'
import { analyticsItem, trackEvent } from '../lib/analytics'

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function ProductPage() {
  const { slug = '' } = useParams()
  const { addProduct } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [added, setAdded] = useState(false)
  const trackedProduct = useRef('')

  useEffect(() => {
    let active = true
    getProductBySlug(slug).then((data) => active && setProduct(data)).catch(() => active && setError(true)).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [slug])

  useEffect(() => {
    if (!product || trackedProduct.current === product.id) return
    trackedProduct.current = product.id
    trackEvent('view_item', { currency: 'BRL', value: product.price, items: [analyticsItem(product)] })
  }, [product])

  if (loading) return <section className="mx-auto min-h-[65vh] max-w-6xl px-5 py-12"><FeedbackState type="loading" /></section>
  if (error || !product) return <section className="mx-auto min-h-[65vh] max-w-6xl px-5 py-12"><h1 className="text-2xl font-black text-forest-950">Produto não encontrado</h1><Link className="mt-5 inline-block font-bold text-forest-700" to="/catalogo">Voltar ao catálogo</Link></section>

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0
  const handleAdd = () => {
    addProduct(product)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  return <section className="mx-auto min-h-[68vh] max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
    <nav className="text-xs text-stone-500" aria-label="Navegação estrutural"><Link className="hover:underline" to="/">Início</Link> / <Link className="hover:underline" to={`/catalogo?categoria=${product.categorySlug}`}>{product.category}</Link> / <span className="text-stone-800">{product.name}</span></nav>
    <div className="mt-6 grid gap-7 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-7 lg:grid-cols-[1fr_1fr_20rem] lg:gap-8">
      <div className="overflow-hidden rounded-2xl bg-stone-100"><img className="aspect-square size-full object-cover" src={product.image} alt={product.name} /></div>
      <div className="py-2"><p className="text-xs font-black tracking-widest text-forest-700 uppercase">{product.category}</p><h1 className="mt-3 text-3xl leading-tight font-black text-forest-950">{product.name}</h1><div className="mt-4 flex items-center gap-2 text-sm"><span className="text-amber-500">★★★★★</span><span className="text-stone-500">{product.rating} ({product.reviews} avaliações)</span></div><hr className="my-6 border-stone-200" />{product.originalPrice && <p className="text-sm text-stone-500"><span className="line-through">{money.format(product.originalPrice)}</span><strong className="ml-2 text-emerald-700">Economize {discount}%</strong></p>}<p className="mt-1 text-4xl font-black text-forest-950">{money.format(product.price)}</p><p className="mt-1 text-sm text-stone-500">Preço por {product.unit}</p><div className="mt-7 rounded-xl bg-forest-50 p-4"><strong className="text-sm text-forest-900">Qualidade Mapinguari</strong><p className="mt-1 text-sm leading-6 text-stone-600">Produto selecionado e armazenado com cuidado para chegar bem até você.</p></div></div>
      <aside className="h-fit rounded-2xl border border-stone-200 p-5 shadow-sm"><p className="text-sm text-stone-600">Entrega em <strong className="text-forest-800">Rio Branco, AC</strong></p><p className="mt-4 font-bold text-emerald-700">{product.stockQuantity > 0 ? 'Em estoque' : 'Indisponível'}</p><p className="mt-1 text-xs text-stone-500">{product.stockQuantity} unidades disponíveis</p><button className="mt-5 w-full rounded-xl bg-sun-400 px-5 py-3.5 font-extrabold text-forest-950 hover:bg-sun-300 disabled:bg-stone-200" disabled={product.stockQuantity <= 0} onClick={handleAdd} type="button">{added ? '✓ Adicionado' : 'Adicionar ao carrinho'}</button><Link className="mt-3 flex w-full justify-center rounded-xl border border-forest-700 px-5 py-3 text-sm font-bold text-forest-800 hover:bg-forest-50" to="/carrinho">Ver carrinho</Link><div className="mt-5 space-y-2 border-t border-stone-200 pt-4 text-xs text-stone-600"><p>🔒 Compra protegida</p><p>🚚 Entrega no mesmo dia*</p><p>↩️ Atendimento facilitado</p></div></aside>
    </div>
  </section>
}
