import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSessionStore } from '@/domains/session/model/session.store'
import { logger } from '@/infrastructure/logging/logger'
import { logout as logoutService } from '../services/auth.service'

export const useLogout = () => {
  const { clearSession } = useSessionStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      logger.debug('Logout attempt started')
      await logoutService()
      logger.info('Logout successful')
    },
    onError: (err) => {
      logger.error('Logout failed', err)
    },
    onSettled: () => {
      clearSession()
      queryClient.clear()
    },
  })
}
