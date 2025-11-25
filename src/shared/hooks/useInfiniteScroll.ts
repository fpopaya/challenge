import { useCallback, useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  hasMore: boolean
  isLoading: boolean
  onLoadMore?: () => void
  threshold?: number
}

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 500,
}: UseInfiniteScrollOptions) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return

    const { scrollTop, scrollHeight, clientHeight } = scrollElement
    const distanceToBottom = scrollHeight - scrollTop - clientHeight
    const scrolledToBottom = distanceToBottom < threshold

    if (scrolledToBottom && hasMore && !isLoading) {
      onLoadMore?.()
    }
  }, [hasMore, isLoading, onLoadMore, threshold])

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement || !hasMore) {
      return
    }

    scrollElement.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [hasMore, handleScroll])

  return { scrollRef }
}
