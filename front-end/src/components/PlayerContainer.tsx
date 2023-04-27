import { Player } from '../../types'

interface PlayerContainerProps extends React.ComponentProps<'div'> {
   playerData: Player
}

export default function PlayerContainer(props: PlayerContainerProps) {
   const { playerData: player, ...rest } = props

   return (
      <div
         {...rest}
         className='w-full h-full flex items-center justify-center hover:w-[125%] transition-all cursor-pointer'
      >
         <div>
            <h1 className='text-3xl'>{player.namefirstlast}</h1>

            <span>Bats: {player.batside.code}</span>
            <span className='ml-3'>Throws: {player.pitchhand.code}</span>
            <p>Position: {player.primaryposition.abbreviation}</p>
            {player.currentteam.name}
         </div>
      </div>
   )
}
