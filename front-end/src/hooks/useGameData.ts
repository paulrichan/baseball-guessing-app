import axios from 'axios'
import { useEffect, useState } from 'react'

export default function useGameData() {
   const [data, setData] = useState([])
   const [isLoading, setIsLoading] = useState(true)

   async function fetchData() {
      await axios
         .get('127.0.0.1:5000/game')
         .then(({ data }) => setData(data))
         .catch((err) => console.error(err))
         .finally(() => setIsLoading(false))
   }

   function refetch() {
      setIsLoading(true)
   }

   useEffect(() => {
      if (isLoading) fetchData()
   }, [isLoading])

   return { data, isLoading, refetch }
}
