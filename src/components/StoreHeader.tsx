import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { Brand } from './Brand'
import { CartIcon, MenuIcon, PinIcon, SearchIcon, UserIcon } from './StoreIcons'
import { StoreMenu } from './StoreMenu'

export function StoreHeader() {
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const { user } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!menuOpen) return

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const term = search.trim()
    setMenuOpen(false)
    navigate(term ? `/catalogo?busca=${encodeURIComponent(term)}` : '/catalogo')
  }

  return (
    <header className="sticky top-0 z-50 shadow-md" ref={headerRef}>
      <div className="bg-forest-950 text-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-3 px-4 py-3 md:flex-nowrap lg:gap-6 lg:px-8">
          <Brand />
          <Link className="hidden min-w-40 items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-white/10 xl:flex" to={user ? '/conta#enderecos' : '/entrar'} aria-label="Selecionar endereço de entrega">
            <PinIcon className="size-6 shrink-0 text-sun-400" />
            <span><small className="block text-xs text-green-100">Entregar em</small><strong className="block text-sm">Rio Branco, AC</strong></span>
          </Link>
          <form className="order-last flex w-full basis-full overflow-hidden rounded-xl bg-white shadow-sm focus-within:ring-3 focus-within:ring-sun-400/60 md:order-none md:basis-auto" role="search" onSubmit={handleSearch}>
            <label className="sr-only" htmlFor="store-search">Buscar produtos</label>
            <input className="min-w-0 flex-1 px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-500" id="store-search" name="search" placeholder="O que você está procurando?" type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
            <button className="grid w-14 place-items-center bg-sun-400 text-forest-950 transition hover:bg-sun-300" type="submit" aria-label="Buscar"><SearchIcon /></button>
          </form>
          <Link className="flex items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-white/10" to={user ? '/conta' : '/entrar'} aria-label={user ? 'Abrir minha conta' : 'Entrar ou cadastrar'}>
            <UserIcon className="size-6 text-sun-400" />
            <span className="hidden whitespace-nowrap lg:block"><small className="block text-xs text-green-100">{user ? 'Olá,' : 'Olá, entre ou cadastre-se'}</small><strong className="block max-w-36 truncate text-sm">{user?.user_metadata.full_name ?? 'Minha conta'}</strong></span>
          </Link>
          <Link className="relative flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-white/10" to="/carrinho" aria-label={itemCount ? `Carrinho com ${itemCount} itens` : 'Carrinho vazio'}>
            <CartIcon className="size-7" /><span className="absolute top-0 left-7 grid size-5 place-items-center rounded-full bg-sun-400 text-xs font-black text-forest-950">{Math.min(itemCount, 99)}</span><strong className="hidden text-sm lg:block">Carrinho</strong>
          </Link>
        </div>
      </div>

      <nav className="relative bg-forest-800 text-sm text-white" aria-label="Navegação principal">
        <div className="mx-auto flex max-w-[1440px] items-center gap-1 px-4 lg:px-8">
          <button className={`flex items-center gap-2 py-3 pr-5 font-bold transition ${menuOpen ? 'text-sun-300' : 'text-white hover:text-sun-300'}`} type="button" onClick={() => setMenuOpen((current) => !current)} aria-controls="store-menu-panel" aria-expanded={menuOpen}>
            <MenuIcon /><span>Menu</span><span className={`ml-1 text-xs transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} aria-hidden="true">▼</span>
          </button>
          <Link className="hidden px-4 py-3 font-medium text-green-50 transition hover:bg-white/10 hover:text-white sm:block" to="/">Início</Link>
          <Link className="hidden px-4 py-3 font-medium text-green-50 transition hover:bg-white/10 hover:text-white md:block" to="/catalogo?categoria=produtos-regionais">Produtos regionais</Link>
          <Link className="hidden px-4 py-3 font-medium text-green-50 transition hover:bg-white/10 hover:text-white lg:block" to="/catalogo?categoria=hortifruti">Frescos</Link>
          <Link className="ml-auto shrink-0 px-4 py-3 font-bold text-sun-300 transition hover:bg-white/10" to="/catalogo">Ofertas do dia</Link>
        </div>
      </nav>
      <StoreMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
