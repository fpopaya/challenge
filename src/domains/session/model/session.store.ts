import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/shared/types/user.types'

interface SessionState {
  token: string | null
  user: User | null
}

interface SessionActions {
  setSession: (session: { token: string; user: User }) => void
  clearSession: () => void
  isAuthenticated: () => boolean
}

export const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setSession: (session) =>
        set({
          token: session.token,
          user: session.user,
        }),

      clearSession: () =>
        set({
          token: null,
          user: null,
        }),

      isAuthenticated: () => get().token !== null,
    }),
    {
      name: 'session-storage',
      storage: {
        getItem: (name) => {
          try {
            const str = sessionStorage.getItem(name)
            return str ? JSON.parse(str) : null
          } catch (error) {
            console.error('Error al leer de sessionStorage:', error)
            return null
          }
        },
        setItem: (name, value) => {
          try {
            sessionStorage.setItem(name, JSON.stringify(value))
          } catch (error) {
            console.error('Error al guardar en sessionStorage:', error)

            if (error instanceof Error && error.name === 'QuotaExceededError') {
              try {
                sessionStorage.clear()
                sessionStorage.setItem(name, JSON.stringify(value))
              } catch (retryError) {
                console.error('Error al reintentar guardar en sessionStorage:', retryError)
              }
            }
          }
        },
        removeItem: (name) => {
          try {
            sessionStorage.removeItem(name)
          } catch (error) {
            console.error('Error al eliminar de sessionStorage:', error)
          }
        },
      },
    }
  )
)
