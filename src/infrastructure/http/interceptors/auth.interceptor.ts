import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useSessionStore } from '@/domains/session/model/session.store'
import { SUPABASE_ANON_KEY } from '@/infrastructure/config/env'
import {
  ForbiddenError,
  NetworkError,
  NotFoundError,
  ServerError,
  TimeoutError,
  UnauthorizedError,
} from '@/infrastructure/errors'

export const authRequestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = useSessionStore.getState().token

  if (config.headers) {
    config.headers.apikey = SUPABASE_ANON_KEY

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
}

export const authErrorInterceptor = (error: unknown): Promise<never> => {
  if (!axios.isAxiosError(error)) {
    return Promise.reject(error)
  }

  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return Promise.reject(new TimeoutError())
    }

    return Promise.reject(new NetworkError())
  }

  const status = error.response.status
  const isAuthEndpoint = error.config?.url?.startsWith('/auth/v1')

  switch (status) {
    case 401:
      if (!isAuthEndpoint) {
        useSessionStore.getState().clearSession()
      }
      return Promise.reject(new UnauthorizedError())

    case 403:
      return Promise.reject(new ForbiddenError())

    case 404:
      return Promise.reject(new NotFoundError())

    case 500:
    case 502:
    case 503:
      return Promise.reject(new ServerError())

    default:
      return Promise.reject(error)
  }
}
