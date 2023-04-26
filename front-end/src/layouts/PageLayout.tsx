import { Link } from 'react-router-dom'

function PageLayout({ children }: any) {
   return (
      <div className='h-screen flex flex-col items-center justify-center'>
         <div className='navbar bg-base-300'>
            <div className='flex-1'>
               <Link to='/' className='btn btn-ghost'>
                  MLB Stats Game
               </Link>
            </div>
            <div className='flex-none'>
               <Link to='/' className='btn-primary btn'>
                  New Game
               </Link>
            </div>
         </div>
         <div className='flex-1 h-full w-full'>{children}</div>
      </div>
   )
}

export default PageLayout
