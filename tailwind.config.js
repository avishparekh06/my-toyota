/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'toyota-red': '#EB0A1E',
        'toyota-black': '#000000',
        'toyota-white': '#FFFFFF',
        'toyota-gray': '#E5E5E5',
      },
      fontFamily: {
        'toyota': ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
