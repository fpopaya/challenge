import { Badge } from '@/shared/components'
import type { Pokemon } from '../types/pokemon.types'
import { PokemonName } from './PokemonName'

interface PokemonCardContentProps {
  item: Pokemon
  itemNumber: number
  typeColor: string
}

export const PokemonCardContent = ({ item, itemNumber, typeColor }: PokemonCardContentProps) => (
  <div className="flex-1 h-full px-2 py-1 md:px-4 bg-gray-900 flex flex-row justify-between items-center gap-1 min-w-0 md:min-h-[64px] lg:min-h-[70px] md:py-0.5 lg:py-2">
    <PokemonName number={itemNumber} name={item.name} />
    <Badge color={typeColor} size="md">
      {item.primaryType}
    </Badge>
  </div>
)
