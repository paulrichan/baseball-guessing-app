import { useLoaderData } from 'react-router-dom'
import { Player, Stats } from '../../types/index.ts'
import { useState } from 'react'
import axios from 'axios'

function Game() {
   const data = useLoaderData() as Array<{ player: Player; stats: Stats }>
   const [isLoading, setIsLoading] = useState(false)
   const [gameData, setGameData] = useState(data)
   const player1 = gameData[0]
   const player2 = gameData[1]

   async function handlePlayerClick(player: string) {
      const isWinner = didWin(data, player)
      // fetches new game data
      if (isWinner) {
         setIsLoading(true)
         await axios
            .get('http://127.0.0.1:5000/game')
            .then(({ data }) => setGameData(data))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false))
      }
   }

   return (
      <div className='flex h-screen'>
         <div className='w-full absolute py-5'>
            <div className='w-fit mx-auto relative'>
               <h3 className='text-center text-xl font-bold'>Who has the best average?</h3>
               <div className='bg-blue-500 absolute h-full top-0 w-full blur-xl -z-10' />
            </div>
         </div>

         {isLoading && (
            <div className='absolute w-screen h-screen bg-neutral-800/50 backdrop-blur-lg text-white flex items-center justify-center text-xl font-bold'>
               Loading...
            </div>
         )}
         <PlayerContainer onClick={() => handlePlayerClick('player1')} playerData={player1} />
         <div className='divider divider-horizontal'>
            <span className='opacity-50'>👈 or 👉</span>
         </div>
         <PlayerContainer onClick={() => handlePlayerClick('player2')} playerData={player2} />
      </div>
   )
}

interface PlayerContainerProps extends React.ComponentProps<'div'> {
   playerData: { player: Player; stats: Stats }
}

function PlayerContainer(props: PlayerContainerProps) {
   const {
      playerData: { player },
      ...rest
   } = props
   return (
      <div {...rest} className='w-full flex items-center justify-center hover:w-[125%] transition-all cursor-pointer'>
         <div>
            <h1 className='text-3xl'>{player.namefirstlast}</h1>
            <span>Bats: {player.batside.code}</span>
            <span className='ml-3'>Throws: {player.pitchhand.code}</span>
            <p>Position: {player.primaryposition.abbreviation}</p>
         </div>
      </div>
   )
}

function didWin(playerStats: Array<{ player: Player; stats: Stats }>, chosenPlayer: string): boolean {
   const compareables: { [key: string]: Stats } = {
      player1: playerStats[0].stats,
      player2: playerStats[1].stats,
   }
   return (
      Number(compareables[chosenPlayer].avg) >
      Number(compareables[chosenPlayer === 'player1' ? 'player2' : 'player1'].avg)
   )
}

export default Game
