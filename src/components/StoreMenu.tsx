import { Link } from 'react-router-dom'
import { storeCategories } from '../data/categories'

type StoreMenuProps = {
  open: boolean
  onClose: () => void
}

export function StoreMenu({ open, onClose }: StoreMenuProps) {
  return (
    <div
      className={`absolute inset-x-0 top-full overflow-y-auto border-t border-white/10 bg-white text-stone-800 shadow-2xl transition-[max-height,opacity,transform] duration-300 ease-out ${open ? 'pointer-events-auto max-h-[min(70vh,32rem)] translate-y-0 opacity-100' : 'pointer-events-none max-h-0 -translate-y-2 opacity-0'}`}
      id="store-menu-panel"
      aria-hidden={!open}
      inert={open ? undefined : true}
    >
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-[.16em] text-forest-700 uppercase">Departamentos</p>
            <h2 className="mt-1 text-2xl font-black text-forest-950">Escolha uma categoria</h2>
          </div>
          <div className="flex items-center gap-2">
            <Link className="hidden rounded-full px-4 py-2 text-sm font-bold text-forest-700 transition hover:bg-green-50 sm:block" onClick={onClose} to="/catalogo">Ver todos os produtos</Link>
            <button className="grid size-10 shrink-0 place-items-center rounded-full bg-stone-100 text-xl text-stone-600 transition hover:bg-stone-200" onClick={onClose} type="button" aria-label="Fechar menu">×</button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-5 sm:gap-3 lg:grid-cols-9">
          {storeCategories.map((category) => (
            <Link
              className="group flex min-h-28 flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-3 text-center transition duration-200 hover:-translate-y-1 hover:border-green-300 hover:bg-green-50 hover:shadow-lg focus-visible:border-forest-700"
              key={category.slug}
              onClick={onClose}
              to={`/catalogo?categoria=${category.slug}`}
            >
              <span className="grid size-12 place-items-center rounded-full bg-forest-50 text-2xl transition duration-200 group-hover:scale-110 group-hover:bg-white sm:size-14 sm:text-3xl" aria-hidden="true">{category.icon}</span>
              <strong className="mt-3 text-xs leading-4 text-forest-950 sm:text-sm">{category.name}</strong>
            </Link>
          ))}
        </div>

        <Link className="mt-4 flex w-full items-center justify-center rounded-xl bg-forest-800 px-4 py-3 text-sm font-bold text-white sm:hidden" onClick={onClose} to="/catalogo">Ver todos os produtos</Link>
      </div>
    </div>
  )
}
