import { Link, useLoaderData, useParams } from 'react-router-dom'
import { Player, Stats } from '../../types/index.ts'
import { useEffect, useRef, useState } from 'react'
import PageLayout from '../layouts/PageLayout.tsx'
// import { humanizeString } from '../../utils/humanizeString.ts'
import useGameData from '../hooks/useGameData.ts'
import PlayerContainer from '../components/PlayerContainer.tsx'
import hitterOptions from '../../utils/hitterOptions.ts'
import { pitcherOptions } from '../../utils/pitcherOptions.ts'

function Game() {
   // Gets url parameters
   const params = useParams()
   // format url parameters to use
   const { player_type, stat_to_compare } = params
   const availableOptions: { [key: string]: any } = player_type === 'hitting' ? hitterOptions : pitcherOptions
   const comparingStat = { key: stat_to_compare as string, readable: availableOptions[stat_to_compare as string] }

   // loader data set at main
   const data = useLoaderData() as Array<{ player: Player; stats: Stats }>

   // custom hook for game data utility
   const { data: gameData, isLoading, fetchNewData } = useGameData(data)
   const player1 = { data: gameData[0].player, statsToCompare: gameData[0].stats[comparingStat.key] }
   const player2 = { data: gameData[1].player, statsToCompare: gameData[1].stats[comparingStat.key] }

   // ref for modal when game is lost
   const lostModalRef = useRef<HTMLInputElement>(null)

   // player's score
   const [score, setScore] = useState(0)

   // Keeps track of the two players when correct response is given
   const [winningDetails, setWinningDetails] = useState<Array<Array<Player>>>([])
   // deletes one winningDetail every 3 seconds
   useEffect(() => {
      let interval: undefined | number
      if (winningDetails) {
         interval = setTimeout(() => {
            const deletedFirstEle = winningDetails.slice(1)
            setWinningDetails(deletedFirstEle)
         }, 1000 * 3)
      } else {
         clearInterval(interval)
      }

      return () => clearInterval(interval)
   }, [winningDetails])

   /** Handles game logic when a player is clicked */
   async function handlePlayerClick(chosenPlayer: string) {
      const { result: isWinner } = didWin(gameData, comparingStat.key, chosenPlayer)
      const player1Win = { ...player1.data, [comparingStat.key]: player1.statsToCompare }
      const player2Win = { ...player2.data, [comparingStat.key]: player2.statsToCompare }

      // fetches new game data
      if (isWinner || (chosenPlayer === 'equal' && typeof isWinner === 'string' && isWinner === 'equal')) {
         setWinningDetails((prev) => [...prev, [player1Win, player2Win]])
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

   // takes array of winningdetails to display notifications
   // TODO: Could be more modular
   const notifications = winningDetails.map((playersDetails, idx) => {
      const player1 = playersDetails[0]
      const player2 = playersDetails[1]
      const stat = stat_to_compare as string

      const winningLogicString =
         Number(player1[stat]) === Number(player2[stat])
            ? '='
            : Number(player1[stat]) > Number(player2[stat])
            ? '>'
            : '<'

      return (
         <div key={idx} className='alert alert-success'>
            <div className='flex flex-col'>
               <span className='font-bold'>{player1.lastname}</span>
               <span>
                  {comparingStat.readable}: {player1[stat]}
               </span>
            </div>
            <div className='divider divider-horizontal'>{winningLogicString}</div>
            <div className='flex flex-col'>
               <span className='font-bold'>{player2.lastname}</span>
               <span>
                  {comparingStat.readable}: {player2[stat]}
               </span>
            </div>
         </div>
      )
   })

   return (
      <>
         <PageLayout>
            <div className='h-full flex flex-col md:flex-row w-full relative'>
               <div className='w-full absolute py-5'>
                  <div className='w-fit mx-auto relative'>
                     <h3 className='text-center text-xl font-bold'>Who has more?</h3>
                     <p>{comparingStat.readable}</p>
                     <div className='bg-zinc-500 absolute h-full top-0 w-full blur-xl -z-10' />
                  </div>
               </div>

               {/* Notifications */}
               <div className='toast toast-center md:toast-end z-30'>{notifications}</div>

               {/* Modal */}
               <input type='checkbox' id='my-modal' className='modal-toggle' ref={lostModalRef} />
               <div className='modal'>
                  <div className='modal-box border-[1px] border-solid border-error border-'>
                     <h1 className='font-bold text-2xl'>Sorry, you lost!</h1>
                     <p className='font-bold text-error mt-3'>
                        {`${player1.data.firstlastname} had ${
                           player1.statsToCompare === player2.statsToCompare
                              ? 'the same'
                              : player1.statsToCompare > player2.statsToCompare
                              ? 'more'
                              : 'less'
                        } ${comparingStat.readable} ${
                           player1.statsToCompare === player2.statsToCompare ? 'as' : 'than'
                        } ${player2.data.firstlastname}`}
                     </p>

                     <div>
                        <p>
                           {player1.data.firstlastname}: {player1.statsToCompare} {comparingStat.readable}{' '}
                        </p>
                        <p>
                           {player2.data.firstlastname}: {player2.statsToCompare} {comparingStat.readable}{' '}
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
               <PlayerContainer onClick={() => handlePlayerClick('player1')} playerData={player1.data} />
               <div className='divider divider-vertical md:divider-horizontal'>
                  <span className='opacity-50 hidden md:block'>👈 or 👉</span>
                  <span className='opacity-50 md:hidden'>☝️ or 👇</span>
               </div>
               <PlayerContainer onClick={() => handlePlayerClick('player2')} playerData={player2.data} />

               <div className='absolute bottom-5 w-full'>
                  <button
                     className='btn btn-primary flex mx-auto mb-3 md:mb-10 w-56'
                     onClick={() => handlePlayerClick('equal')}
                  >
                     Equal
                  </button>
                  <p className='text-center text-4xl'>Score: {score}</p>
               </div>
            </div>
         </PageLayout>
      </>
   )
}

/** Determines if guess is correct
 *
 * User can choose equal or one player.
 */
function didWin(
   playerStats: Array<{ player: Player; stats: Stats }>,
   statToCompare: string,
   chosenPlayer?: string
): { result: boolean | 'equal' } {
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
