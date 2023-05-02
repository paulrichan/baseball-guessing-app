/** @type {import('tailwindcss').Config} */
import daisy from 'daisyui'

export default {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   theme: {
      extend: {},
   },
   plugins: [daisy],
   daisyui: {
      darkTheme: 'dark',
   },
}
