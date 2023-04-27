import axios from 'axios'
import { useState } from 'react'
import { Player, Stats } from '../../types'
import { useParams } from 'react-router-dom'

export default function useGameData(loaderData: Array<{ player: Player; stats: Stats }>) {
   const params = useParams()
   const { player_type, stat_to_compare } = params
   const [data, setData] = useState(loaderData)
   const [isLoading, setIsLoading] = useState(false)

   async function fetchNewData() {
      const fetchString = `http://127.0.0.1:5000/game/${player_type}/${stat_to_compare}`
      setIsLoading(true)
      await axios
         .get(fetchString)
         .then(({ data }) => setData(data))
         .catch((err) => console.error(err))
         .finally(() => setIsLoading(false))
   }

   return { data, isLoading, fetchNewData, setIsLoading }
}
