import type { ReactNode } from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { logger } from '@/infrastructure/logging/logger'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error
  resetErrorBoundary: () => void
}) => {
  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="max-w-[600px] text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-3xl font-bold text-white m-0 mb-4">Algo salió mal</h1>
        <p className="text-base text-gray-200 m-0 mb-12">
          Lo sentimos, ocurrió un error inesperado.
        </p>

        {import.meta.env.DEV && (
          <details className="text-left my-12 p-4 bg-gray-100 border border-gray-200 rounded-lg">
            <summary className="cursor-pointer text-primary font-medium mb-3 hover:underline">
              Detalles del error
            </summary>
            <pre className="mt-4 mb-0 p-4 bg-gray-50 rounded overflow-x-auto text-sm text-gray-200 whitespace-pre-wrap break-words">
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            type="button"
            onClick={resetErrorBoundary}
            className="py-4 px-8 bg-primary text-gray-900 border-none rounded-2xl text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0"
          >
            Intentar de nuevo
          </button>
          <button
            type="button"
            onClick={handleGoHome}
            className="py-4 px-8 bg-gray-100 text-white border border-gray-200 rounded-2xl text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-700 hover:border-primary"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  )
}

export const ErrorBoundary = ({ children, fallback }: ErrorBoundaryProps) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
      onError={(error, errorInfo) => {
        logger.error('ErrorBoundary caught an error:', error, errorInfo)
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}
