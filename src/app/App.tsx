import { RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AppProvider } from './providers/AppProvider'
import { router } from './router/router'

export const App = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="flex flex-col h-full min-h-0">
          <RouterProvider router={router} />
        </div>
      </AppProvider>
    </ErrorBoundary>
  )
}
