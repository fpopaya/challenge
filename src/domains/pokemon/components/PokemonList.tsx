import { EmptyState, LoadingOverlay } from '@/shared/components'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { useVirtualizedGrid } from '../hooks/useVirtualizedGrid'
import type { Pokemon } from '../types/pokemon.types'
import { PokemonVirtualList } from './PokemonVirtualList'

interface PokemonListProps {
  items: Pokemon[]
  hasMore?: boolean
  isLoadingMore?: boolean
  onLoadMore?: () => void
}

export const PokemonList = ({
  items,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}: PokemonListProps) => {
  const { scrollRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore,
  })

  const { virtualItems, totalSize } = useVirtualizedGrid({
    itemsCount: items.length,
    scrollElementRef: scrollRef,
  })

  if (!items.length) {
    return (
      <section
        className="h-full overflow-auto smooth-scroll bg-white flex justify-center"
        aria-label="Lista de Pokémon"
      >
        <div className="flex items-center justify-center flex-col gap-3.5 min-h-[300px] px-8 py-4">
          <EmptyState />
          <p className="text-base text-gray-500 text-center m-0">No se encontraron Pokémones</p>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={scrollRef}
      className="flex-1 overflow-auto smooth-scroll bg-white flex justify-center"
      aria-label="Lista de Pokémon"
    >
      <div className="w-full max-w-[700px] px-2 pt-2 pb-12 md:px-6 md:pt-4 lg:px-8 lg:pt-6">
        <PokemonVirtualList items={items} virtualItems={virtualItems} totalSize={totalSize} />

        {hasMore && isLoadingMore && (
          <LoadingOverlay text="Cargando más Pokémones..." size="small" />
        )}
      </div>
    </section>
  )
}
