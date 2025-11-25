import type { VirtualItem } from '@tanstack/react-virtual'
import type { Pokemon } from '../types/pokemon.types'
import { PokemonCard } from './PokemonCard'

interface PokemonVirtualListProps {
  items: Pokemon[]
  virtualItems: VirtualItem[]
  totalSize: number
}

export const PokemonVirtualList = ({ items, virtualItems, totalSize }: PokemonVirtualListProps) => {
  return (
    <div className="relative w-full" style={{ height: `${totalSize}px` }}>
      {virtualItems.map((virtualItem) => {
        const item = items[virtualItem.index]

        if (!item) return null

        const itemNumber = virtualItem.index + 1

        return (
          <div
            key={virtualItem.key}
            className="flex w-full justify-center items-start py-1 absolute top-0 left-0 right-0"
            style={{ transform: `translateY(${virtualItem.start}px)` }}
          >
            <PokemonCard item={item} itemNumber={itemNumber} />
          </div>
        )
      })}
    </div>
  )
}
