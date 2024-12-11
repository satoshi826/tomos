/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        kosugimaru: ['Kosugi Maru'],
      },
    },
  },
  daisyui: {
    themes: ['business'],
  },
  plugins: [require('daisyui')],
}
