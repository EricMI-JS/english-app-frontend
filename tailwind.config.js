/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Open Sans', 'sans-serif'], // Agrega la nueva fuente
      },
    },
  },
  plugins: [],
}