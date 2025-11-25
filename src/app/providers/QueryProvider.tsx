import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren, useState } from 'react'
import { CACHE_TIME } from '@/infrastructure/config/env'
import { AppError } from '@/infrastructure/errors'

export const QueryProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (error instanceof AppError && error.statusCode && error.statusCode < 500) {
                return false
              }

              return failureCount < 3
            },

            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false,
            staleTime: CACHE_TIME,
            gcTime: CACHE_TIME * 2,
          },

          mutations: {
            retry: false,
          },
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
