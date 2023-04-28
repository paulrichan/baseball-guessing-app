import axios from 'axios'

export const gameLoader = async ({ params }: any) => {
   const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/game/${params.player_type}/${params.stat_to_compare}`
   )
   return data
}
