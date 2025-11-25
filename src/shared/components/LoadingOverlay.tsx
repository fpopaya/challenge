import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'

const spinnerVariants = cva('border-3 border-gray-200 border-t-primary rounded-full animate-spin', {
  variants: {
    size: {
      small: 'w-[30px] h-[30px] border-2',
      medium: 'w-[50px] h-[50px] border-3',
      large: 'w-[70px] h-[70px] border-4',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
})

interface LoadingOverlayProps extends VariantProps<typeof spinnerVariants> {
  text?: string
  fullScreen?: boolean
}

export const LoadingOverlay = ({
  text = 'Cargando...',
  size = 'medium',
  fullScreen = false,
}: LoadingOverlayProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center min-h-[200px] w-full',
        fullScreen && 'fixed inset-0 min-h-screen bg-black/20 z-[9999] backdrop-blur-sm'
      )}
    >
      <output className="flex flex-col items-center gap-4" aria-live="polite">
        <div className={spinnerVariants({ size })} aria-hidden="true" />
        {text && <p className="m-0 text-sm text-gray-600 font-medium">{text}</p>}
      </output>
    </div>
  )
}
