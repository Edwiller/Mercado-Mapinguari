/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { MainLayout } from '../layouts/MainLayout'

const AccountPage = lazy(() => import('../pages/AccountPage').then((module) => ({ default: module.AccountPage })))
const AuthPage = lazy(() => import('../pages/AuthPage').then((module) => ({ default: module.AuthPage })))
const CartPage = lazy(() => import('../pages/CartPage').then((module) => ({ default: module.CartPage })))
const CatalogPage = lazy(() => import('../pages/CatalogPage').then((module) => ({ default: module.CatalogPage })))
const CheckoutPage = lazy(() => import('../pages/CheckoutPage').then((module) => ({ default: module.CheckoutPage })))
const HomePage = lazy(() => import('../pages/HomePage').then((module) => ({ default: module.HomePage })))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))
const OrderPage = lazy(() => import('../pages/OrderPage').then((module) => ({ default: module.OrderPage })))
const ProductPage = lazy(() => import('../pages/ProductPage').then((module) => ({ default: module.ProductPage })))
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage').then((module) => ({ default: module.ResetPasswordPage })))

function page(element: ReactNode) {
  return <Suspense fallback={<div className="grid min-h-[55vh] place-items-center"><div className="size-10 animate-spin rounded-full border-4 border-green-100 border-t-forest-700" aria-label="Carregando página" /></div>}>{element}</Suspense>
}

function protectedPage(element: ReactNode) {
  return <ProtectedRoute>{page(element)}</ProtectedRoute>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: page(<HomePage />) },
      { path: 'catalogo', element: page(<CatalogPage />) },
      { path: 'produto/:slug', element: page(<ProductPage />) },
      { path: 'carrinho', element: page(<CartPage />) },
      { path: 'checkout', element: protectedPage(<CheckoutPage />) },
      { path: 'pedidos/:id', element: protectedPage(<OrderPage />) },
      { path: 'entrar', element: page(<AuthPage />) },
      { path: 'redefinir-senha', element: page(<ResetPasswordPage />) },
      { path: 'conta', element: protectedPage(<AccountPage />) },
      { path: '*', element: page(<NotFoundPage />) },
    ],
  },
])
