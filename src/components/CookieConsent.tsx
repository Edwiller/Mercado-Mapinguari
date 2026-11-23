import { useEffect, useState } from 'react'
import { analyticsPreferencesEvent, getAnalyticsConsent, setAnalyticsConsent } from '../lib/analytics'

export function CookieConsent() {
  const [open, setOpen] = useState(() => getAnalyticsConsent() === null)

  useEffect(() => {
    const showPreferences = () => setOpen(true)
    window.addEventListener(analyticsPreferencesEvent, showPreferences)
    return () => window.removeEventListener(analyticsPreferencesEvent, showPreferences)
  }, [])

  if (!open) return null

  const choose = (granted: boolean) => {
    setAnalyticsConsent(granted)
    setOpen(false)
  }

  return <aside className="fixed right-4 bottom-4 left-4 z-[80] mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl sm:p-6" aria-labelledby="cookie-title" role="dialog" aria-modal="true">
    <div className="flex items-start gap-4"><span className="text-3xl" aria-hidden="true">🍪</span><div><h2 className="text-lg font-black text-forest-950" id="cookie-title">Sua privacidade importa</h2><p className="mt-2 text-sm leading-6 text-stone-600">Usamos cookies necessários para o funcionamento do carrinho. Com sua autorização, o Google Analytics 4 também coleta dados de uso sem enviar nome, e-mail ou endereço, ajudando a melhorar a experiência.</p></div></div>
    <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-bold text-stone-700 hover:bg-stone-50" onClick={() => choose(false)} type="button">Somente necessários</button><button className="rounded-xl bg-forest-800 px-5 py-3 text-sm font-bold text-white hover:bg-forest-700" onClick={() => choose(true)} type="button">Aceitar Analytics</button></div>
  </aside>
}
