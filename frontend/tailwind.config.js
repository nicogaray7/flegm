/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css,scss}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A63429',
          hover: '#A63429'
        }
      },
      animation: {
        'upvote': 'upvoteAnimation 0.3s ease-in-out'
      },
      keyframes: {
        upvoteAnimation: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' }
        }
      }
    },
  },
  plugins: [],
}