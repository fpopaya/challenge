import { ServerError, UnauthorizedError } from '@/infrastructure/errors'
import { axiosInstance } from '@/infrastructure/http/axios.config'
import type { Session } from '@/shared/types/user.types'
import type { LoginCredentials } from '../types/auth.schema'

interface SupabaseAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  user: {
    id: string
    email: string
    user_metadata?: {
      name?: string
    }
  }
}

export const login = async (credentials: LoginCredentials): Promise<Session> => {
  try {
    const { data } = await axiosInstance.post<SupabaseAuthResponse>(
      '/auth/v1/token?grant_type=password',
      {
        email: credentials.email,
        password: credentials.password,
      }
    )

    return {
      token: data.access_token,
      user: {
        id: data.user.id,
        email: data.user.email || credentials.email,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuario',
      },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'

    if (message.includes('Invalid') || message.includes('400')) {
      throw new UnauthorizedError('Credenciales inválidas')
    }

    throw new ServerError(`Error en el servicio de autenticación: ${message}`)
  }
}

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/v1/logout', {})
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    throw new ServerError(`Error al cerrar sesión: ${message}`)
  }
}
