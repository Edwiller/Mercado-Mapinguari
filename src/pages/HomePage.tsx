import { ProductCard } from '../components/ProductCard'
import { SectionHeading } from '../components/SectionHeading'
import { LeafIcon, ShieldIcon, TruckIcon } from '../components/StoreIcons'
import { FeedbackState } from '../components/FeedbackState'
import { useProducts } from '../hooks/useProducts'
import { Link } from 'react-router-dom'
import { useState, type FormEvent } from 'react'

const categories = [
  ['Hortifruti', 'Frutas, verduras e legumes', '🥬', 'bg-emerald-100', 'hortifruti'],
  ['Açougue', 'Carnes e aves selecionadas', '🥩', 'bg-red-100', 'acougue'],
  ['Padaria', 'Pães fresquinhos todo dia', '🥖', 'bg-amber-100', 'padaria'],
  ['Laticínios', 'Leites, queijos e iogurtes', '🥛', 'bg-sky-100', 'laticinios'],
  ['Bebidas', 'Para refrescar qualquer hora', '🧃', 'bg-orange-100', 'bebidas'],
  ['Limpeza', 'Sua casa sempre cuidada', '🧹', 'bg-violet-100', 'limpeza'],
  ['Higiene', 'Cuidados para toda família', '🧴', 'bg-pink-100', 'higiene'],
  ['Regionais', 'Sabores da nossa terra', '🌿', 'bg-lime-100', 'produtos-regionais'],
]

export function HomePage() {
  const { products, loading, error, reload } = useProducts()
  const [postcode, setPostcode] = useState('')
  const [postcodeMessage, setPostcodeMessage] = useState('')
  const featuredProducts = products.filter((product) => product.featured).slice(0, 10)
  const regionalProducts = products.filter((product) => product.categorySlug === 'produtos-regionais').slice(0, 4)
  const checkPostcode = (event: FormEvent) => {
    event.preventDefault()
    const digits = postcode.replace(/\D/g, '')
    setPostcodeMessage(digits.length === 8 ? 'CEP válido para simulação. A disponibilidade final será confirmada no checkout.' : 'Digite um CEP com 8 números.')
  }

  return (
    <>
      <div className="bg-sun-400 px-4 py-2 text-center text-xs font-bold text-forest-950 sm:text-sm">Frete grátis na primeira compra acima de R$ 149 • Use o cupom <span className="rounded bg-white/70 px-1.5 py-0.5">BEMVINDO</span></div>

      <section className="relative isolate overflow-hidden bg-forest-900 text-white">
        <img className="absolute inset-0 -z-20 size-full object-cover opacity-35" src="https://cdn.hercampus.com/SH6M70M3/as/h5nmxhhr3sgtwx5g7fh7hx3q/grocery_store_by_Mehrad_Vosoughi_from_Unsplash?fit=crop&height=900&width=1800" alt="Corredor organizado de supermercado com produtos frescos" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-forest-950 via-forest-950/90 to-forest-900/25" />
        <div className="mx-auto flex min-h-[31rem] max-w-[1440px] items-center px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-sun-300/40 bg-sun-400/15 px-4 py-2 text-xs font-black tracking-widest text-sun-300 uppercase backdrop-blur">Semana da economia</span>
            <h1 className="mt-6 text-4xl leading-[1.05] font-black tracking-tight sm:text-6xl">Sua compra do mês com preço baixo de verdade.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-green-50 sm:text-lg">Do hortifruti aos produtos da nossa terra: qualidade, variedade e entrega no mesmo dia em Rio Branco.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="rounded-xl bg-sun-400 px-6 py-3.5 font-extrabold text-forest-950 shadow-lg transition hover:bg-sun-300" href="#ofertas">Ver ofertas</a>
              <a className="rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20" href="#regionais">Conhecer produtos regionais</a>
            </div>
            <p className="mt-6 text-xs text-green-100">* Entrega, cupons e preços apresentados são demonstrativos.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white" aria-label="Benefícios">
        <div className="mx-auto grid max-w-[1440px] divide-y divide-stone-200 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          <div className="flex items-center gap-4 py-5 sm:px-6"><TruckIcon className="size-8 shrink-0 text-forest-700" /><div><strong className="text-sm text-forest-950">Entrega no mesmo dia</strong><p className="text-xs text-stone-500">Consulte bairros atendidos</p></div></div>
          <div className="flex items-center gap-4 py-5 sm:px-6"><LeafIcon className="size-8 shrink-0 text-forest-700" /><div><strong className="text-sm text-forest-950">Frescor garantido</strong><p className="text-xs text-stone-500">Seleção cuidadosa dos produtos</p></div></div>
          <div className="flex items-center gap-4 py-5 sm:px-6"><ShieldIcon className="size-8 shrink-0 text-forest-700" /><div><strong className="text-sm text-forest-950">Compra segura</strong><p className="text-xs text-stone-500">Ambiente protegido e confiável</p></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8" id="categorias">
        <SectionHeading title="Compre por categoria" description="Tudo o que você precisa, organizado para encontrar rapidinho." linkLabel="Todos os departamentos" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map(([name, description, icon, color, slug]) => <Link className="group rounded-2xl border border-stone-200 bg-white p-3 text-center transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg" to={`/catalogo?categoria=${slug}`} key={name}><span className={`mx-auto grid aspect-square w-full max-w-28 place-items-center rounded-xl text-4xl ${color} transition group-hover:scale-105`} aria-hidden="true">{icon}</span><strong className="mt-3 block text-sm text-forest-950">{name}</strong><span className="mt-1 hidden text-[.68rem] leading-4 text-stone-500 lg:block">{description}</span></Link>)}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-14 sm:px-8" id="ofertas">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200 sm:p-8">
          <SectionHeading eyebrow="Preços que cabem no bolso" title="Ofertas do dia" description="Aproveite os preços especiais enquanto durarem os estoques demonstrativos." />
          {loading ? <FeedbackState type="loading" /> : error ? <FeedbackState type="error" onRetry={() => void reload()} /> : <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5" id="produtos">{featuredProducts.map((product) => <ProductCard product={product} key={product.id} />)}</div>}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-14 sm:px-8">
        <div className="grid overflow-hidden rounded-3xl bg-terra-700 text-white lg:grid-cols-[.8fr_1.2fr]">
          <div className="flex flex-col justify-center p-8 sm:p-12"><p className="text-xs font-black tracking-[.18em] text-amber-200 uppercase">Clube Mapinguari</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Economize em toda compra.</h2><p className="mt-4 max-w-md leading-7 text-orange-50">Ofertas exclusivas, cupons personalizados e benefícios para quem faz parte do clube.</p><a className="mt-7 w-fit rounded-xl bg-white px-5 py-3 font-bold text-terra-800" href="#rodape">Quero conhecer</a></div>
          <div className="min-h-72 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=82')] bg-cover bg-center" role="img" aria-label="Pessoa fazendo compras em um supermercado" />
        </div>
      </section>

      <section className="bg-forest-50 py-14" id="regionais">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8"><SectionHeading eyebrow="Orgulho da Amazônia" title="Sabores da nossa terra" description="Uma seleção que valoriza ingredientes regionais e produtores locais." />{!loading && !error && <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{regionalProducts.map((product) => <ProductCard product={product} key={product.id} />)}</div>}</div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8">
        <div className="rounded-3xl border border-green-200 bg-white p-7 text-center sm:p-10"><span className="text-3xl" aria-hidden="true">📍</span><h2 className="mt-3 text-2xl font-black text-forest-950">Receba suas compras onde estiver</h2><p className="mx-auto mt-3 max-w-xl text-stone-600">Informe seu CEP para consultar disponibilidade e estimar o frete. No momento, a experiência é demonstrativa e usa exemplos de Rio Branco, Acre.</p><form className="mx-auto mt-6 flex max-w-md gap-2" onSubmit={checkPostcode}><label className="sr-only" htmlFor="postcode">CEP</label><input className="min-w-0 flex-1 rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-forest-700 focus:ring-3 focus:ring-green-100" id="postcode" inputMode="numeric" maxLength={9} placeholder="Digite seu CEP" value={postcode} onChange={(event) => setPostcode(event.target.value)} /><button className="rounded-xl bg-forest-800 px-5 py-3 font-bold text-white hover:bg-forest-700" type="submit">Consultar</button></form>{postcodeMessage && <p className="mx-auto mt-3 max-w-md text-sm text-forest-700" role="status">{postcodeMessage}</p>}</div>
      </section>
    </>
  )
}
