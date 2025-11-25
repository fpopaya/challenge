import { useCallback } from 'react'
import { PokemonList } from '@/domains/pokemon/components/PokemonList'
import { useInfiniteItems } from '@/domains/pokemon/hooks/useInfiniteItems'
import { getErrorMessage } from '@/infrastructure/errors'
import { Button, EmptyState, LoadingOverlay } from '@/shared/components'

export const PokemonListPage = () => {
  const { items, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteItems()

  const handleLoadMore = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage()
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage])

  if (isLoading && !items.length)
    return <LoadingOverlay text="Cargando Pokémones..." size="medium" />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 flex-1 p-8 text-center bg-white">
        <EmptyState />
        <p className="text-lg text-danger m-0 font-medium">{getErrorMessage(error)}</p>
        <Button onClick={() => refetch()}>Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col items-center gap-2 pt-8 pb-6 px-4 bg-white">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 m-0">Bienvenido a TenpoPoke</h1>
        <p className="text-base md:text-lg text-gray-600 m-0">
          Explora el mundo de los Pokémon y atrápalos todos.
        </p>
      </div>

      <PokemonList
        items={items}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
        onLoadMore={handleLoadMore}
      />
    </div>
  )
}
