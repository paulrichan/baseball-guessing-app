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
         <div className='flex flex-col justify-center items-center h-full gap-5'>
            <h1 className='font-bold text-3xl text-center'>Ready to test your baseball knowledge?</h1>

            <div className='form-control gap-5'>
               <div className='flex flex-col gap-2'>
                  <div className='flex items-center'>
                     <input
                        type='radio'
                        name='radio-3'
                        className='radio radio-secondary'
                        onChange={() => setPlayerType('pitching')}
                        checked={playerType === 'pitching'}
                     />
                     <span className='ml-3'>Pitching</span>
                  </div>
                  <div className='flex items-center'>
                     <input
                        type='radio'
                        name='radio-3'
                        className='radio radio-secondary'
                        onChange={() => setPlayerType('hitting')}
                        checked={playerType === 'hitting'}
                     />
                     <span className='ml-3'>Hitting</span>
                  </div>
               </div>
               <label className='input-group input-group-vertical'>
                  <span>Stats to Compare</span>
                  <select className='select select-bordered' onChange={(e) => setStatToCompare(e.currentTarget.value)}>
                     {playerOptions}
                  </select>
               </label>
            </div>

            <Link to={`/game/${playerType}/${statToCompare}`} className='btn'>
               Play Game!
            </Link>
         </div>
      </PageLayout>
   )
}

export default App
