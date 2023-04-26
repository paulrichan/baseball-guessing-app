import { Link, useLoaderData, useParams } from 'react-router-dom'
import { Player, Stats } from '../../types/index.ts'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import PageLayout from '../layouts/PageLayout.tsx'
import { convertToEnglishPhrase } from '../../utils/convertToEnglishPhrase'

function Game() {
   const params = useParams()
   const data = useLoaderData() as Array<{ player: Player; stats: Stats }>
   const [isLoading, setIsLoading] = useState(false)
   const [gameData, setGameData] = useState(data)
   const lostModalRef = useRef<HTMLInputElement>(null)
   const [score, setScore] = useState(0)
   const player1 = gameData[0]
   const player2 = gameData[1]
   const { player_type, stat_to_compare } = params
   const [winningDetails, setWinningDetails] = useState<Array<Array<Player>>>([])
   const englishStatPhrase = convertToEnglishPhrase(stat_to_compare as string)
   const playerStatsToCompare = {
      p1: player1.stats[stat_to_compare as string],
      p2: player2.stats[stat_to_compare as string],
   }

   async function handlePlayerClick(player: string) {
      const { result: isWinner } = didWin(gameData, stat_to_compare as string, player)
      const winner1 = { ...player1.player, [stat_to_compare as string]: playerStatsToCompare.p1 }
      const winner2 = { ...player2.player, [stat_to_compare as string]: playerStatsToCompare.p2 }

      // fetches new game data
      if (isWinner || (player === 'equal' && isWinner === 'equal')) {
         setWinningDetails((prev) => [...prev, [winner1, winner2]])
         await fetchNewData()
         setScore((prev) => prev + 1)
      } else {
         setWinningDetails([])
         if (lostModalRef.current) {
            lostModalRef.current.checked = true
         }
         setScore(0)
      }
   }

   async function fetchNewData() {
      const fetchString = `http://127.0.0.1:5000/game/${player_type}/${stat_to_compare}`
      setIsLoading(true)
      await axios
         .get(fetchString)
         .then(({ data }) => setGameData(data))
         .catch((err) => console.error(err))
         .finally(() => setIsLoading(false))
   }

   useEffect(() => {
      let interval: any
      if (winningDetails) {
         interval = setTimeout(() => {
            const deletedFirstEle = winningDetails.slice(1)
            setWinningDetails(deletedFirstEle)
         }, 1000 * 3)
      }

      return () => clearInterval(interval)
   }, [winningDetails])

   const notifications = winningDetails.map((playersDetails, idx) => {
      const player1 = playersDetails[0]
      const player2 = playersDetails[1]
      const stat = stat_to_compare as string

      return (
         <div key={idx} className='alert alert-success'>
            <div className='flex flex-col'>
               <span className='font-bold'>{player1.lastname}</span>
               <span>
                  {englishStatPhrase}: {player1[stat]}
               </span>
            </div>
            <div className='divider divider-horizontal'>
               {player1[stat] === player2[stat] ? '=' : player1[stat] > player2[stat] ? '>' : '<'}
            </div>
            <div className='flex flex-col'>
               <span className='font-bold'>{player2.lastname}</span>
               <span>
                  {englishStatPhrase}: {player2[stat]}
               </span>
            </div>
         </div>
      )
   })

   return (
      <PageLayout>
         <div className='h-full flex w-full relative'>
            <div className='w-full absolute py-5'>
               <div className='w-fit mx-auto relative'>
                  <h3 className='text-center text-xl font-bold'>{englishStatPhrase}</h3>
                  <div className='bg-zinc-500 absolute h-full top-0 w-full blur-xl -z-10' />
               </div>
            </div>

            {/* Notifications */}
            <div className='toast z-30'>{notifications}</div>

            {/* Modal */}
            <input type='checkbox' id='my-modal' className='modal-toggle' ref={lostModalRef} />
            <div className='modal'>
               <div className='modal-box border-[1px] border-solid border-error border-'>
                  <h1 className='font-bold text-2xl'>Sorry, you lost!</h1>
                  <p className='font-bold text-error mt-3'>
                     {`${player1.player.firstlastname} had ${
                        playerStatsToCompare.p1 === playerStatsToCompare.p2
                           ? 'the same'
                           : playerStatsToCompare.p1 > playerStatsToCompare.p2
                           ? 'more'
                           : 'less'
                     } ${englishStatPhrase} ${playerStatsToCompare.p1 === playerStatsToCompare.p2 ? 'as' : 'than'} ${
                        player2.player.firstlastname
                     }`}
                  </p>

                  <div>
                     <p>
                        {player1.player.firstlastname}: {playerStatsToCompare.p1} {englishStatPhrase}{' '}
                     </p>
                     <p>
                        {player2.player.firstlastname}: {playerStatsToCompare.p2} {englishStatPhrase}{' '}
                     </p>
                  </div>

                  <p className='py-4'>
                     You can play again with the same game settings or head back to the main page to play with new
                     parameters.
                  </p>
                  <div className='modal-action'>
                     <Link to='/' className='btn btn-warning'>
                        New Game
                     </Link>
                     <label htmlFor='my-modal' onClick={async () => await fetchNewData()} className='btn'>
                        Play Again
                     </label>
                  </div>
               </div>
            </div>

            {isLoading && (
               <div className='absolute z-20 w-full h-full bg-neutral-800/50 backdrop-blur-lg text-white flex items-center justify-center text-xl font-bold'>
                  Loading...
               </div>
            )}
            <PlayerContainer onClick={() => handlePlayerClick('player1')} playerData={player1} />
            <div className='divider divider-horizontal'>
               <span className='opacity-50'>👈 or 👉</span>
            </div>
            <PlayerContainer onClick={() => handlePlayerClick('player2')} playerData={player2} />

            <div className='absolute bottom-5 w-full'>
               <button className='btn btn-primary flex mx-auto mb-10 w-56' onClick={() => handlePlayerClick('equal')}>
                  Equal
               </button>
               <p className='text-center text-4xl'>Score: {score}</p>
            </div>
         </div>
      </PageLayout>
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
            {player.currentteam.name}
         </div>
      </div>
   )
}

function didWin(
   playerStats: Array<{ player: Player; stats: Stats }>,
   statToCompare: string,
   chosenPlayer?: string
): { result: boolean | string } {
   const compareables: { [key: string]: Stats } = {
      player1: playerStats[0].stats,
      player2: playerStats[1].stats,
   }

   if (chosenPlayer !== 'equal') {
      const chosenPlayerStatToCompare = Number(compareables[chosenPlayer ?? ''][statToCompare])
      const otherPlayerStatToCompare = Number(
         compareables[chosenPlayer === 'player1' ? 'player2' : 'player1'][statToCompare]
      )
      return {
         result: chosenPlayerStatToCompare > otherPlayerStatToCompare,
      }
   }

   return {
      result:
         chosenPlayer === 'equal' &&
         Number(compareables.player1[statToCompare]) === Number(compareables.player2[statToCompare])
            ? 'equal'
            : false,
   }
}

export default Game
