type SectionHeadingProps = { eyebrow?: string; title: string; description?: string; linkLabel?: string }

export function SectionHeading({ eyebrow, title, description, linkLabel = 'Ver tudo' }: SectionHeadingProps) {
  return (
    <div className="mb-7 flex items-end justify-between gap-5">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-black tracking-[.18em] text-forest-700 uppercase">{eyebrow}</p>}
        <h2 className="text-2xl font-black tracking-tight text-forest-950 sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">{description}</p>}
      </div>
      <a className="hidden shrink-0 text-sm font-bold text-forest-700 hover:underline sm:block" href="#produtos">{linkLabel} →</a>
    </div>
  )
}
