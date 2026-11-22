import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthProvider'
import { CartProvider } from '../contexts/CartProvider'
import { router } from '../routes/router'

export function App() {
  return <AuthProvider><CartProvider><RouterProvider router={router} /></CartProvider></AuthProvider>
}
