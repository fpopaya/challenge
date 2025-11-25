import { ServerError } from '@/infrastructure/errors'
import { axiosInstance } from '@/infrastructure/http/axios.config'
import type { Pokemon, PokemonDto } from '../types/pokemon.types'
import { mapDtoToPokemon } from '../types/pokemon.types'

interface PaginationParams {
  offset: number
  limit: number
}

interface PokemonPageResponse {
  items: Pokemon[]
  nextPage: PaginationParams | null
  totalCount: number
}

const parseContentRange = (header: string | undefined): number => {
  const count = Number.parseInt(header?.split('/')[1] ?? '0', 10)
  return count > 0 ? count : 0
}

export const getPaginated = async ({
  offset,
  limit,
}: PaginationParams): Promise<PokemonPageResponse> => {
  try {
    const { data, headers } = await axiosInstance.get<PokemonDto[]>('/rest/v1/items', {
      headers: {
        Prefer: 'count=exact',
      },
      params: {
        select: '*',
        order: 'id.asc',
        offset,
        limit,
      },
    })

    const items = data.map(mapDtoToPokemon)
    const totalCount = parseContentRange(headers['content-range'])
    const nextOffset = offset + limit
    const hasMore = nextOffset < totalCount

    return {
      items,
      nextPage: hasMore ? { offset: nextOffset, limit } : null,
      totalCount,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    throw new ServerError(`Error al obtener Pokémon: ${message}`)
  }
}
