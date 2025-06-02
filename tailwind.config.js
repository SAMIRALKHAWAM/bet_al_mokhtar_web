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
    fontSize: {
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem',
  },
  },
  plugins: [],
   darkMode: 'class',
}