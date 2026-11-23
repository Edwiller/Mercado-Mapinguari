import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { analyticsConsentEvent, getAnalyticsConsent, initializeAnalytics, trackPageView } from '../lib/analytics'

export function RouteAnalytics() {
  const location = useLocation()
  const lastPath = useRef('')

  useEffect(() => {
    initializeAnalytics()
  }, [])

  useEffect(() => {
    const path = `${location.pathname}${location.search}`
    if (lastPath.current === path) return
    lastPath.current = path
    trackPageView(path)
  }, [location.pathname, location.search])

  useEffect(() => {
    const sendCurrentPage = () => {
      if (getAnalyticsConsent() === true) trackPageView(`${location.pathname}${location.search}`)
    }
    window.addEventListener(analyticsConsentEvent, sendCurrentPage)
    return () => window.removeEventListener(analyticsConsentEvent, sendCurrentPage)
  }, [location.pathname, location.search])

  return null
}

