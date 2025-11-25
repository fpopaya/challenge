import { useVirtualizer } from '@tanstack/react-virtual'
import type { RefObject } from 'react'
import { ITEM_HEIGHT } from '../constants'

interface UseVirtualizedGridProps {
  itemsCount: number
  scrollElementRef: RefObject<HTMLDivElement | null>
  overscan?: number
}

export const useVirtualizedGrid = ({
  itemsCount,
  scrollElementRef,
  overscan = 5,
}: UseVirtualizedGridProps) => {
  const virtualizer = useVirtualizer({
    count: itemsCount,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan,
  })

  return {
    virtualItems: virtualizer.getVirtualItems(),
    totalSize: virtualizer.getTotalSize(),
    virtualizer,
  }
}
