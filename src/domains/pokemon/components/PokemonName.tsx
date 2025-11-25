interface PokemonNameProps {
  number: number
  name: string
}

export const PokemonName = ({ number, name }: PokemonNameProps) => (
  <h3 className="text-[13px] md:text-sm lg:text-[15px] font-bold text-white m-0 capitalize leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
    #{number} {name}
  </h3>
)
