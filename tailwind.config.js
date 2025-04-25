/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       fontFamily:{
        sans: ['Roboto', 'sans-serif'],
       },
       gridTemplateColumns : {
        '70/30' :'80% 28%'
       },
       colors : {
        color :'red'
       }

    },
  },
  plugins: [],
}