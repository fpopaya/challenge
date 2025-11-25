import { lazy, type ReactNode, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useSessionStore } from '@/domains/session/model/session.store'
import { LoadingOverlay } from '@/shared/components'
import { PrivateLayout } from '../layouts/PrivateLayout'
import { PublicLayout } from '../layouts/PublicLayout'

const LoginPage = lazy(() =>
  import('@/domains/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
)
const PokemonListPage = lazy(() =>
  import('@/domains/pokemon/pages/PokemonListPage').then((m) => ({
    default: m.PokemonListPage,
  }))
)

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated())
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const GuestRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated())
  return isAuthenticated ? <Navigate to="/home" replace /> : children
}

const Loader = ({ children }: { children: ReactNode }) => {
  return <Suspense fallback={<LoadingOverlay />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    element: (
      <GuestRoute>
        <PublicLayout />
      </GuestRoute>
    ),
    children: [
      {
        path: '/login',
        element: (
          <Loader>
            <LoginPage />
          </Loader>
        ),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <PrivateLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/home',
        element: (
          <Loader>
            <PokemonListPage />
          </Loader>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])
