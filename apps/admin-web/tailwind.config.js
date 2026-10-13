/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        unisinu: {
          red: '#e42313',
          'red-hover': '#c81e10',
          'red-dark': '#9e1408',
          'red-light': '#fef2f2',
          gold: '#ffb606',
          'gold-hover': '#e6a300',
          'gold-light': '#fffbeb',
          navy: '#1a202c',
          dark: '#1e242e',
        },
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
