import axios from 'axios'

export const gameLoader = async () => {
   const { data } = await axios.get('http://127.0.0.1:5000/game')
   return data
}
