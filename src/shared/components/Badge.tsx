import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full text-white font-bold tracking-wide whitespace-nowrap shrink-0 capitalize px-2 py-0.5 transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-700',
        primary: 'bg-primary text-gray-900',
        success: 'bg-success text-gray-900',
        danger: 'bg-danger',
        warning: 'bg-warning text-gray-900',
      },
      size: {
        sm: 'text-[10px] min-w-[60px] px-2 py-0.5',
        md: 'text-[11px] min-w-[70px] px-2.5 py-1',
        lg: 'text-xs min-w-[80px] px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
)

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode
  color?: string
  className?: string
}

export const Badge = ({ children, variant, size, color, className }: BadgeProps) => {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      style={color ? { backgroundColor: color } : undefined}
    >
      {children}
    </span>
  )
}
