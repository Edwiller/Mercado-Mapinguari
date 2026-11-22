import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

type ProtectedRouteProps = { children: ReactNode }

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="grid min-h-[55vh] place-items-center"><div className="size-10 animate-spin rounded-full border-4 border-green-100 border-t-forest-700" aria-label="Verificando sessão" /></div>
  if (!user) return <Navigate to="/entrar" replace state={{ from: location.pathname }} />
  return children
}
