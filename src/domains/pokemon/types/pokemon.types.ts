import { POKEMON_TYPE_COLORS } from '../constants'

export type PokemonTypeName =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dark'
  | 'dragon'
  | 'steel'
  | 'fairy'

export type PokemonDto = {
  id: number
  pokemon_id: number
  name: string
  image_url: string | null
  primary_type: string | null
}

export type Pokemon = {
  id: number
  name: string
  imageUrl: string | null
  primaryType: PokemonTypeName
}

const isValidPokemonType = (type: string | null): type is PokemonTypeName => {
  if (!type) return false
  return type in POKEMON_TYPE_COLORS
}

export const mapDtoToPokemon = (dto: PokemonDto): Pokemon => ({
  id: dto.pokemon_id,
  name: dto.name,
  imageUrl: dto.image_url,
  primaryType: isValidPokemonType(dto.primary_type) ? dto.primary_type : 'normal',
})

export const getPokemonColor = (primaryType: PokemonTypeName): string =>
  POKEMON_TYPE_COLORS[primaryType]
