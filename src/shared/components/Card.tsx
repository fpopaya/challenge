import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-lg overflow-hidden',
        'flex flex-row items-center shadow-sm w-full h-card-height',
        'transition-all duration-200 active:opacity-90',
        'md:hover:shadow-lg md:hover:-translate-y-0.5 md:active:opacity-100',
        className
      )}
    >
      {children}
    </div>
  )
}
