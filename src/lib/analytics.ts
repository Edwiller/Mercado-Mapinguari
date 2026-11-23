import type { Product } from '../types/product'

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()
const consentKey = 'mercado-mapinguari-analytics-consent'
export const analyticsConsentEvent = 'mercado-mapinguari:analytics-consent'
export const analyticsPreferencesEvent = 'mercado-mapinguari:analytics-preferences'

type AnalyticsParams = Record<string, unknown>

declare global {
  interface Window {
    dataLayer?: unknown[][]
  }
}

let initialized = false

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(args)
}

export function getAnalyticsConsent() {
  const saved = localStorage.getItem(consentKey)
  return saved === 'granted' ? true : saved === 'denied' ? false : null
}

export function setAnalyticsConsent(granted: boolean) {
  localStorage.setItem(consentKey, granted ? 'granted' : 'denied')
  window.dispatchEvent(new CustomEvent(analyticsConsentEvent, { detail: granted }))
  if (granted) initializeAnalytics()
}

export function initializeAnalytics() {
  if (initialized || !measurementId || getAnalyticsConsent() !== true) return false

  initialized = true
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  script.dataset.mercadoAnalytics = 'true'
  document.head.appendChild(script)

  gtag('js', new Date())
  gtag('config', measurementId, {
    send_page_view: false,
    anonymize_ip: true,
  })
  return true
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (getAnalyticsConsent() !== true || !measurementId) return
  initializeAnalytics()
  gtag('event', name, params)
}

export function trackPageView(path = `${window.location.pathname}${window.location.search}`) {
  trackEvent('page_view', {
    page_title: document.title,
    page_location: `${window.location.origin}${path}`,
    page_path: path,
  })
}

export function analyticsItem(product: Product, quantity = 1, index?: number) {
  return {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    item_list_name: 'Catálogo Mercado Mapinguari',
    price: product.price,
    quantity,
    ...(index === undefined ? {} : { index }),
  }
}

export function openAnalyticsPreferences() {
  window.dispatchEvent(new Event(analyticsPreferencesEvent))
}

