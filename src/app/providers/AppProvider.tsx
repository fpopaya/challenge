import type { PropsWithChildren } from 'react'
import { QueryProvider } from './QueryProvider'

export const AppProvider = ({ children }: PropsWithChildren) => {
  return <QueryProvider>{children}</QueryProvider>
}
