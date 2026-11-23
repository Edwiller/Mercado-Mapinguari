import { Outlet, useLocation } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { CookieConsent } from '../components/CookieConsent'
import { RouteAnalytics } from '../components/RouteAnalytics'
import { StoreHeader } from '../components/StoreHeader'
import { openAnalyticsPreferences } from '../lib/analytics'

const footerGroups = [
  ['Institucional', 'Quem somos', 'Nossas lojas', 'Trabalhe conosco'],
  ['Atendimento', 'Central de ajuda', 'Trocas e devoluções', 'Fale conosco'],
  ['Políticas', 'Privacidade', 'Termos de uso', 'Preferências de cookies'],
]

export function MainLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-market-50 text-stone-900">
      <StoreHeader />
      <RouteAnalytics />
      <main className="page-transition" key={`${location.pathname}${location.search}`}><Outlet /></main>
      <footer className="bg-forest-950 text-white">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.3fr_2fr]">
          <div><Brand /><p className="mt-5 max-w-sm text-sm leading-6 text-green-100">Compras práticas, produtos frescos e os sabores da Amazônia chegando até você.</p><p className="mt-5 inline-flex rounded-md border border-sun-400/30 bg-sun-400/10 px-3 py-2 text-xs font-bold text-sun-300">Projeto acadêmico demonstrativo</p></div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">{footerGroups.map(([title, ...links]) => <div key={title}><h2 className="font-bold">{title}</h2><ul className="mt-4 space-y-3 text-sm text-green-100">{links.map((link) => <li key={link}>{link === 'Preferências de cookies' ? <button className="text-left hover:text-white hover:underline" onClick={openAnalyticsPreferences} type="button">{link}</button> : <a className="hover:text-white hover:underline" href="#rodape">{link}</a>}</li>)}</ul></div>)}</div>
        </div>
        <div className="border-t border-white/10 px-5 py-6 text-center text-xs text-green-200" id="rodape">© 2026 Mercado Mapinguari. Projeto acadêmico — preços e operações são simulados.</div>
      </footer>
      <CookieConsent />
    </div>
  )
}
