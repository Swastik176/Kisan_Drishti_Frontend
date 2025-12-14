/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kisan-green': '#22c55e',
        'kisan-dark-green': '#16a34a',
        'kisan-darker-green': '#15803d',
      },
    },
  },
  plugins: [],
}

