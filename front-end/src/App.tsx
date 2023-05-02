import { Link } from 'react-router-dom'
import PageLayout from './layouts/PageLayout'
import { useState } from 'react'
import hitterOptions from '../utils/hitterOptions.ts'
import { pitcherOptions } from '../utils/pitcherOptions.ts'

function App() {
   const [playerType, setPlayerType] = useState('pitching')
   const availableOptions = playerType === 'hitting' ? hitterOptions : pitcherOptions
   const [statToCompare, setStatToCompare] = useState(Object.keys(availableOptions)[0])

   const playerOptions = Object.entries(availableOptions).map(([value, name], idx) => (
      <option key={idx} value={value}>
         {name}
      </option>
   ))

   return (
      <PageLayout>
         <div className='flex flex-col relative justify-evenly items-center h-full gap-5 bg-[url(/stadium-ai.jpg)]'>
            <div className='h-full absolute bg-neutral-900/70 backdrop-blur-md w-full z-0'></div>

            <div className='z-10 flex flex-col justify-evenly items-center h-full'>
               <h1 className='font-bold text-3xl md:text-7xl text-center font-mono'>
                  Ready to test your baseball knowledge?
               </h1>

               <div className='flex flex-col gap-5'>
                  <p>Choose which category you would like to compare:</p>

                  <div className='flex justify-evenly w-full'>
                     <button
                        className={`btn btn-lg ${playerType === 'pitching' && 'btn-primary'}`}
                        onClick={() => setPlayerType('pitching')}
                     >
                        Pitching
                     </button>
                     <button
                        className={`btn btn-lg ${playerType === 'hitting' && 'btn-primary'}`}
                        onClick={() => setPlayerType('hitting')}
                     >
                        Hitting
                     </button>
                  </div>
               </div>

               <div>
                  <p className='mb-5'>
                     Choose a <span className='text-secondary font-bold'>{playerType.toUpperCase()}</span> stat to
                     compare:
                  </p>
                  <label className='input-group input-group-vertical input-group-lg'>
                     <span>Stats to Compare</span>
                     <select
                        className='select select-bordered select-primary'
                        onChange={(e) => setStatToCompare(e.currentTarget.value)}
                     >
                        {playerOptions}
                     </select>
                  </label>
               </div>

               <Link to={`/game/${playerType}/${statToCompare}`} className='btn btn-primary btn-lg'>
                  Play Game!
               </Link>
            </div>
         </div>
      </PageLayout>
   )
}

export default App
