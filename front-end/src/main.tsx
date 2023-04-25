import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Game from './pages/Game.tsx'
import { gameLoader } from './loaders/gameLoader.ts'

const router = createBrowserRouter([
   {
      path: '/',
      element: <App />,
      // loader: rootLoader,
      // children: [
      //   {
      //     path: "team",
      //     element: <Team />,
      //     // loader: teamLoader,
      //   },
      // ],
   },
   {
      path: '/game',
      loader: gameLoader,
      element: <Game />,
   },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
   <React.StrictMode>
      <RouterProvider router={router} />
   </React.StrictMode>
)
