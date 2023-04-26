import axios from 'axios'

export const gameLoader = async ({ params }: any) => {
   const { data } = await axios.get(`http://127.0.0.1:5000/game/${params.player_type}/${params.stat_to_compare}`)
   return data
}
