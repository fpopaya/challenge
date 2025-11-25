import { useInfiniteQuery } from '@tanstack/react-query'
import { CACHE_TIME } from '@/infrastructure/config/env'
import { ITEMS_PER_PAGE } from '../constants'
import { getPaginated } from '../services/pokemon.service'

export const useInfiniteItems = () => {
  const query = useInfiniteQuery({
    queryKey: ['pokemon-infinite'],
    queryFn: ({ pageParam }) => getPaginated(pageParam),
    initialPageParam: { offset: 0, limit: ITEMS_PER_PAGE },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME * 2,
  })

  const items = query.data?.pages.flatMap((page) => page.items) ?? []

  return {
    items,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  }
}
