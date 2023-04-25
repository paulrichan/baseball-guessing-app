import { Link } from 'react-router-dom'

function App() {
   return (
      <div className='h-screen flex flex-col items-center justify-center'>
         <h1>Ready to test your baseball knowledge?</h1>
         <Link to='/game' className='btn'>
            Play Game!
         </Link>
      </div>
   )
}

export default App
