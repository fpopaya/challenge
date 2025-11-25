import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 font-medium rounded-lg border-none cursor-pointer transition-all duration-200 font-inherit focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-gray-900 hover:bg-primary/90 active:scale-95',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:scale-95',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:scale-95',
      },
      size: {
        small: 'px-4 py-2 text-sm',
        medium: 'px-6 py-2.5 text-base',
        large: 'px-8 py-3 text-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
      fullWidth: false,
    },
  }
)

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode
  isLoading?: boolean
  disabled?: boolean
}

export const Button = ({
  children,
  isLoading = false,
  variant,
  size,
  fullWidth,
  disabled = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading

  return (
    <button
      type={type}
      className={cn(
        buttonVariants({ variant, size, fullWidth }),
        isDisabled && 'cursor-not-allowed opacity-60',
        className
      )}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </span>
      )}
      <span className={isLoading ? 'invisible' : ''}>{children}</span>
    </button>
  )
}
