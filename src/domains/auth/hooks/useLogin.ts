import { useMutation } from '@tanstack/react-query'
import { ZodError } from 'zod'
import { useSessionStore } from '@/domains/session/model/session.store'
import { logger } from '@/infrastructure/logging/logger'
import { login } from '../services/auth.service'
import { loginSchema } from '../types/auth.schema'

export const useLogin = () => {
  const { setSession } = useSessionStore()

  return useMutation({
    mutationFn: async (credentials: unknown) => {
      logger.debug('Login attempt started', { email: (credentials as { email?: string })?.email })

      const validated = loginSchema.parse(credentials)
      const session = await login(validated)
      logger.info('Login successful', { userId: session.user.id })

      return session
    },
    onSuccess: (session) => {
      setSession(session)
    },
    onError: (err) => {
      if (err instanceof ZodError) {
        logger.warn('Login validation failed', { issues: err.issues })
      } else {
        logger.error('Login failed', err)
      }
    },
  })
}
