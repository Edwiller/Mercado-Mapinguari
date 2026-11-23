import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FeedbackState } from '../components/FeedbackState'
import { ProductCard } from '../components/ProductCard'
import { storeCategories } from '../data/categories'
import { useProducts } from '../hooks/useProducts'
import { analyticsItem, trackEvent } from '../lib/analytics'

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, loading, error, reload } = useProducts()
  const requestedCategory = searchParams.get('categoria') ?? 'todos'
  const selected = requestedCategory === 'todos' || storeCategories.some((category) => category.slug === requestedCategory) ? requestedCategory : 'todos'
  const search = searchParams.get('busca')?.trim().toLocaleLowerCase('pt-BR') ?? ''
  const sort = searchParams.get('ordem') ?? 'relevancia'

  const filteredProducts = useMemo(() => {
    const allowedSlugs = selected === 'todos' ? null : [selected]
    const result = products.filter((product) => {
      const matchesCategory = !allowedSlugs || allowedSlugs.includes(product.categorySlug)
      const matchesSearch = !search || `${product.name} ${product.category}`.toLocaleLowerCase('pt-BR').includes(search)
      return matchesCategory && matchesSearch
    })

    return [...result].sort((a, b) => {
      if (sort === 'menor-preco') return a.price - b.price
      if (sort === 'maior-preco') return b.price - a.price
      if (sort === 'avaliacao') return b.rating - a.rating
      return Number(Boolean(b.badge)) - Number(Boolean(a.badge))
    })
  }, [products, search, selected, sort])

  const selectedLabel = storeCategories.find((category) => category.slug === selected)?.name
    ?? 'Todos os produtos'

  useEffect(() => {
    if (loading || !filteredProducts.length) return
    trackEvent('view_item_list', {
      item_list_name: selectedLabel,
      items: filteredProducts.slice(0, 20).map((product, index) => analyticsItem(product, 1, index)),
    })
  }, [filteredProducts, loading, selectedLabel])

  const setParam = (name: string, value: string, defaultValue: string) => {
    const next = new URLSearchParams(searchParams)
    if (value === defaultValue) next.delete(name)
    else next.set(name, value)
    setSearchParams(next)
  }

  return (
    <section className="mx-auto min-h-[70vh] max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <nav className="text-xs text-stone-500" aria-label="Navegação estrutural">Início / Catálogo / <span className="text-stone-800">{selectedLabel}</span></nav>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black tracking-widest text-forest-700 uppercase">Catálogo Mercado Mapinguari</p>
          <h1 className="mt-2 text-3xl font-black text-forest-950 sm:text-4xl">{search ? `Busca por “${searchParams.get('busca')}”` : selectedLabel}</h1>
          <p className="mt-2 text-sm text-stone-500">{filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}</p>
        </div>
        <label className="flex items-center gap-2 text-sm font-bold text-stone-700">Ordenar por
          <select className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-forest-700 focus:ring-3 focus:ring-green-100" value={sort} onChange={(event) => setParam('ordem', event.target.value, 'relevancia')}>
            <option value="relevancia">Relevância</option><option value="menor-preco">Menor preço</option><option value="maior-preco">Maior preço</option><option value="avaliacao">Melhor avaliação</option>
          </select>
        </label>
      </div>

      <div className="no-scrollbar mt-7 overflow-x-auto pb-2" aria-label="Filtros rápidos">
        <div className="flex min-w-max gap-2">
          <button className={`rounded-full border px-4 py-2 text-sm font-bold transition duration-200 ${selected === 'todos' ? 'border-forest-800 bg-forest-800 text-white shadow-md' : 'border-stone-300 bg-white text-stone-700 hover:border-green-400 hover:bg-green-50'}`} onClick={() => setParam('categoria', 'todos', 'todos')} type="button" aria-pressed={selected === 'todos'}>Todos</button>
          {storeCategories.map((category) => <button className={`rounded-full border px-4 py-2 text-sm font-bold transition duration-200 ${selected === category.slug ? 'border-forest-800 bg-forest-800 text-white shadow-md' : 'border-stone-300 bg-white text-stone-700 hover:border-green-400 hover:bg-green-50'}`} key={category.slug} onClick={() => setParam('categoria', category.slug, 'todos')} type="button" aria-pressed={selected === category.slug}>{category.icon} {category.name}</button>)}
        </div>
      </div>

      {loading ? <div className="mt-7"><FeedbackState type="loading" /></div> : error ? <div className="mt-7"><FeedbackState type="error" onRetry={() => void reload()} /></div> : filteredProducts.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.map((product, index) => <div className="product-reveal" style={{ animationDelay: `${Math.min(index, 9) * 45}ms` }} key={product.id}><ProductCard product={product} /></div>)}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm"><span className="text-4xl">🔎</span><h2 className="mt-4 text-xl font-black text-forest-950">Nenhum produto encontrado</h2><p className="mt-2 text-sm text-stone-500">Tente outra busca ou escolha uma categoria diferente.</p><button className="mt-5 rounded-xl bg-forest-800 px-5 py-3 text-sm font-bold text-white" onClick={() => setSearchParams({})} type="button">Ver todos os produtos</button></div>
      )}
    </section>
  )
}
