import { Link } from 'react-router-dom'

type BrandProps = {
  compact?: boolean
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <Link className="inline-flex shrink-0 items-center gap-2.5" to="/" aria-label="Mercado Mapinguari — página inicial">
      <span className="relative grid size-10 place-items-center rounded-[.7rem_.7rem_1.2rem_.7rem] bg-sun-400 text-lg font-black text-forest-950 shadow-sm" aria-hidden="true">
        M<span className="absolute -top-1 -right-1 size-3 rotate-45 rounded-[80%_0] bg-green-400" />
      </span>
      <span className={compact ? undefined : 'hidden min-[390px]:block'}>
        <strong className="block whitespace-nowrap text-lg leading-none tracking-tight">Mercado <span className="text-sun-400">Mapinguari</span></strong>
        {!compact && <small className="mt-1 hidden text-[.68rem] tracking-wide text-green-100 uppercase sm:block">Seu mercado, nossa terra</small>}
      </span>
    </Link>
  )
}
