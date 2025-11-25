import { Card } from '@/shared/components'
import type { Pokemon } from '../types/pokemon.types'
import { getPokemonColor } from '../types/pokemon.types'
import { PokemonCardContent } from './PokemonCardContent'
import { PokemonCardImage } from './PokemonCardImage'

interface PokemonCardProps {
  item: Pokemon
  itemNumber: number
}

export const PokemonCard = ({ item, itemNumber }: PokemonCardProps) => {
  const typeColor = getPokemonColor(item.primaryType)

  return (
    <Card>
      <PokemonCardImage
        imageUrl={item.imageUrl}
        alt={`${item.name} - Pokemon tipo ${item.primaryType}`}
      />
      <PokemonCardContent item={item} itemNumber={itemNumber} typeColor={typeColor} />
    </Card>
  )
}
